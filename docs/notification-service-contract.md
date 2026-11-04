# Notification Service Contract v1

## Ownership and roles

| Concern                    | Owner                                                    |
|----------------------------|----------------------------------------------------------|
| Notification history       | `notification-service` (`notification_service` database) |
| Template catalogue         | `notification-service`                                   |
| Recipient email and locale | `notification-service` (projection of auth events)       |
| User identity and profile  | `auth-service`                                           |
| Booking lifecycle          | `booking-service`                                        |

Roles consumed from the access token (`scope` claim or `role`/`authorities` claim):

| Role         | Capabilities                                                                  |
|--------------|-------------------------------------------------------------------------------|
| `USER`       | Read own notifications, read own attempts, mark own in-app notifications read |
| `ADMIN`      | Read any notification, retry a delivery, read and register templates          |
| `SUPERVISOR` | Read the template catalogue                                                   |

## Consumed events

The service binds two queues on the `global-booking.events` topic exchange.

| Queue                                 | Binding key   | Envelope                                                |
|---------------------------------------|---------------|---------------------------------------------------------|
| `notification-service.auth-events`    | `auth.user.*` | [envelope-v1](./events/envelope-v1.md) with auth `data` |
| `notification-service.booking-events` | `booking.*`   | Booking envelope (see below)                            |

### Booking envelope

```json
{
  "eventId": "3f1c1b1e-....",
  "eventType": "BookingConfirmed",
  "eventVersion": 1,
  "aggregateId": "booking-uuid",
  "occurredAt": "2026-11-04T11:00:00Z",
  "userId": "user-uuid",
  "data": {
    "id": "booking-uuid",
    "userId": "user-uuid",
    "businessId": "uuid",
    "establishmentId": "uuid",
    "bookingServiceId": "uuid",
    "resourceId": "uuid",
    "startAt": "2026-11-10T14:00:00Z",
    "endAt": "2026-11-10T15:00:00Z",
    "status": "CONFIRMED",
    "notes": "optional",
    "createdAt": "2026-11-04T10:30:00Z",
    "updatedAt": "2026-11-04T11:00:00Z",
    "cancelledAt": null
  }
}
```

Fields consumed: `eventId`, `eventType`, `eventVersion`, `occurredAt`, `userId` (falls back to `data.userId`),
`data.id`, `data.startAt`, `data.endAt`, `data.status`, and the optional identifiers. Unknown fields are ignored.

### Processing rules

| Situation                                   | Behaviour                                           |
|---------------------------------------------|-----------------------------------------------------|
| Event already in `processed_events`         | Ignored, acknowledged                               |
| Malformed payload or unsupported version    | Permanent failure, routed to the DLQ                |
| Unsupported `eventType`                     | Permanent failure, routed to the DLQ                |
| Recipient unknown (booking before auth)     | Transient failure, retried with backoff             |
| Template or variable missing                | Permanent failure until the template is fixed (DLQ) |
| Deleted recipient                           | Skipped silently, event recorded as processed       |
| Duplicate `UserDeleted`/`UserStatusChanged` | Ignored through the projection event timestamp      |

## HTTP API

### `GET /api/notifications`

Query parameters: `status`, `channel` (`EMAIL`, `IN_APP`), `unreadOnly`, `page` (0-1000), `size` (1-100),
`sort` (`createdAt|updatedAt|sentAt|status`, default `createdAt,desc`).

```json
{
  "content": [
    {
      "id": "uuid",
      "recipientUserId": "uuid",
      "channel": "EMAIL",
      "templateCode": "BOOKING_CONFIRMED",
      "templateVersion": 2,
      "locale": "en",
      "subject": "Confirmed: 1A2B3C4D on 10 Nov 2026, 14:00 UTC",
      "body": "Hello Ana, ...",
      "status": "SENT",
      "attempts": 1,
      "sourceEventId": "uuid",
      "sourceEventType": "BookingConfirmed",
      "correlationId": "string-or-null",
      "nextAttemptAt": null,
      "sentAt": "2026-11-04T11:00:03Z",
      "failedAt": null,
      "readAt": null,
      "lastError": null,
      "createdAt": "2026-11-04T11:00:00Z",
      "updatedAt": "2026-11-04T11:00:03Z"
    }
  ],
  "totalElements": 1
}
```

Users only see their own notifications; `ADMIN` sees all.

`attempts` counts every delivery attempt performed for the notification. In-app notifications are created as `SENT`
with `attempts = 0`, and an administrative retry resets the counter.

### `GET /api/notifications/unread-count`

```json
{
  "unread": 3
}
```

Counts `IN_APP` notifications where `readAt` is null.

### `GET /api/notifications/{id}` and `GET /api/notifications/{id}/attempts`

Returns the notification or its delivery attempts:

```json
[
  {
    "id": 12,
    "attemptNumber": 1,
    "outcome": "FAILED",
    "errorMessage": "EmailDeliveryException: SMTP delivery failed: ...",
    "attemptedAt": "2026-11-04T11:00:03Z"
  }
]
```

### `POST /api/notifications/{id}/read`

Marks an `IN_APP` notification as read. Returns `400` (`NOTIFICATION_NOT_READABLE`) for `EMAIL`.

### `POST /api/notifications/{id}/retry`

Administrator only. Allowed for `FAILED` and `DEAD_LETTERED`; resets the attempt budget and sets `nextAttemptAt` to the
current time. Returns `409` (`NOTIFICATION_NOT_RETRYABLE`) otherwise.

### `GET /api/notification-templates`

Optional `code` filter. Returns every version, newest first:

```json
[
  {
    "id": "uuid",
    "code": "BOOKING_CONFIRMED",
    "channel": "EMAIL",
    "locale": "en",
    "version": 2,
    "subjectTemplate": "Confirmed: {{bookingReference}} on {{startAt}}",
    "bodyTemplate": "Hello {{recipientName}}, ...",
    "active": true,
    "description": "Booking confirmed email, concise version",
    "createdAt": "2026-11-04T10:00:00Z",
    "updatedAt": "2026-11-04T10:00:00Z"
  }
]
```

### `POST /api/notification-templates`

Administrator only. Registers the next version of `(code, channel, locale)`; existing versions are immutable.

```json
{
  "code": "BOOKING_CONFIRMED",
  "channel": "EMAIL",
  "locale": "en",
  "subjectTemplate": "Confirmed: {{bookingReference}}",
  "bodyTemplate": "Hello {{recipientName}}, your booking is confirmed.",
  "description": "Short confirmation"
}
```

Returns `201` with the created version.

## Notification states

| Status          | Meaning                                                      |
|-----------------|--------------------------------------------------------------|
| `PENDING`       | Persisted and waiting for the dispatcher                     |
| `SENDING`       | Attempt in progress (released after the interrupted timeout) |
| `SENT`          | Delivered (in-app notifications are created as `SENT`)       |
| `FAILED`        | Attempt failed, another attempt is scheduled                 |
| `DEAD_LETTERED` | Attempt budget exhausted, manual retry required              |
| `CANCELLED`     | Reserved for future use                                      |

## Template variables

| Template              | Variables                                                                                                                                                           |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `USER_REGISTERED`     | `recipientName`, `recipientEmail`, `role`, `accountStatus`                                                                                                          |
| `USER_STATUS_CHANGED` | `recipientName`, `recipientEmail`, `previousStatus`, `newStatus`                                                                                                    |
| `USER_DELETED`        | `recipientName`, `recipientEmail`, `deletedAt`                                                                                                                      |
| `BOOKING_*`           | `recipientName`, `recipientEmail`, `bookingReference`, `bookingId`, `bookingStatus`, `startAt`, `endAt`, `businessId`, `establishmentId`, `serviceId`, `resourceId` |

Rendering is strict: an unresolved placeholder fails the notification instead of producing an empty value.

## Error codes

| Code                         | HTTP | Meaning                                         |
|------------------------------|------|-------------------------------------------------|
| `VALIDATION_ERROR`           | 400  | Invalid request payload                         |
| `INVALID_REQUEST`            | 400  | Business rule rejected the request              |
| `AUTHENTICATION_FAILED`      | 401  | Missing or invalid token                        |
| `TOKEN_EXPIRED`              | 401  | Expired access token                            |
| `TOKEN_INVALID`              | 401  | Token that cannot be trusted                    |
| `ACCESS_DENIED`              | 403  | Authenticated caller lacks the required role    |
| `NOTIFICATION_NOT_FOUND`     | 404  | Notification not found                          |
| `ENDPOINT_NOT_FOUND`         | 404  | Unknown endpoint                                |
| `TEMPLATE_NOT_FOUND`         | 404  | No active template for the selection            |
| `NOTIFICATION_NOT_RETRYABLE` | 409  | Delivery cannot be retried in the current state |
| `RECIPIENT_UNAVAILABLE`      | 409  | Recipient projection does not know the user     |
| `TEMPLATE_RENDERING_FAILED`  | 422  | Missing template variable                       |
| `EVENT_INVALID`              | 422  | Invalid or unsupported event                    |
| `INTERNAL_ERROR`             | 500  | Unexpected failure                              |

Errors use the shared envelope:

```json
{
  "timestamp": "2026-11-04T12:00:00Z",
  "status": 404,
  "error": "Not Found",
  "code": "NOTIFICATION_NOT_FOUND",
  "message": "Notification not found.",
  "path": "/api/notifications/9f1c...",
  "traceId": "2b3f...",
  "details": []
}
```

## Messaging guarantees

| Aspect              | Guarantee                                                                    |
|---------------------|------------------------------------------------------------------------------|
| Delivery            | At least once; idempotent per `(eventId, consumerName)`                      |
| Acknowledgement     | Manual, after the transaction commits                                        |
| Retry schedule      | 5 s, 30 s, 5 min (`NOTIFICATION_RETRY_DELAYS_MS`), then DLQ                  |
| Retry mechanism     | Durable TTL queues per delay, replayed through `<queue>.replay`              |
| Dead-letter trigger | Permanent failure, retry exhaustion, or forwarding failure (queue arguments) |
| Dead-letter audit   | `dead_lettered_events` keeps payload, reason, routing key and retry count    |
| Ordering            | Not guaranteed; the projection ignores outdated auth events by timestamp     |
