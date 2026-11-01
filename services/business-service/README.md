# Business Service

The `business-service` owns the booking-domain catalog and maintains a local projection of users from `auth-service`.

## Responsibilities

- Consume `UserRegistered`, `UserUpdated`, `UserDeleted`, and `UserStatusChanged` from RabbitMQ.
- Keep `user_profiles` locally, without reading the auth-service database.
- Ignore duplicate events through `processed_events`.
- Ignore older events through `user_profiles.last_event_at`.
- Expose the booking domain REST API.
- Enforce JWT authentication and owner/role authorization.

The listener uses manual acknowledgements. The initial implementation dead-letters unexpected failures immediately;
delayed retry queues can be added after the first consumer flow is validated.

## Local build

```bash
./mvnw -B test
./mvnw -B package
```

## Domain model

```text
UserProfile (identity projection)
    └── Business (owner_user_id)
          └── Establishment
                ├── BookingService
                └── Resource
```

## Structure

```text
src/main/java/com/globalbooking/business
    ├── api
    │   └── BusinessDtos.java
    ├── controller
    │   └── BusinessController.java
    ├── domain
    │   ├── Business.java
    │   ├── Establishment.java
    │   ├── BookingService.java
    │   └── Resource.java
    ├── repository
    │   ├── BusinessRepository.java
    │   ├── EstablishmentRepository.java
    │   ├── BookingServiceRepository.java
    │   └── ResourceRepository.java
    └── security
        └── Actor.java
```

A `Business` is owned by the authenticated JWT subject. `OPERATOR` can manage owned businesses. `SUPERVISOR` and `ADMIN`
can manage all businesses. `USER` can authenticate but cannot create or manage businesses.

## REST API

All `/api/**` endpoints require `Authorization: Bearer <access-token>`.

```text
GET    /api/businesses
POST   /api/businesses
GET    /api/businesses/{id}
PUT    /api/businesses/{id}
DELETE /api/businesses/{id}

GET    /api/businesses/{businessId}/establishments
POST   /api/businesses/{businessId}/establishments
PUT    /api/establishments/{id}
DELETE /api/establishments/{id}

GET    /api/establishments/{establishmentId}/services
POST   /api/establishments/{establishmentId}/services
PUT    /api/services/{id}
DELETE /api/services/{id}

GET    /api/establishments/{establishmentId}/resources
POST   /api/establishments/{establishmentId}/resources
PUT    /api/resources/{id}
DELETE /api/resources/{id}
```

### Actuator Endpoints

```text
GET /actuator/health
GET /actuator/health/liveness
GET /actuator/health/readiness
GET /actuator/prometheus
```

Deletes are soft deletes. This preserves auditability and prevents old references from becoming ambiguous.

## Event reliability

Permanent event errors (invalid envelope, unsupported event type, missing required field) are rejected and routed to the
consumer DLQ. Unexpected infrastructure/database errors are allowed to fail the listener and are retried with
exponential backoff:

```text
initial interval: 1 second
multiplier:      2.0
maximum interval: 10 seconds
attempts:        3 by default
final destination: business-service.auth-events.dlq
```

## RabbitMQ topology

```text
Exchange: global-booking.events
Binding:  auth.user.*
Queue:    business-service.auth-events
DLX:      global-booking.events.dlx
DLQ:      business-service.auth-events.dlq
```