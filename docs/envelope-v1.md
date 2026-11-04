# Event Envelope — Version 1

All events must follow this envelope. The specific payload is in the `data` field and is validated by the schema
corresponding to the `eventType` and `eventVersion`.

## Example

```json
{
  "eventId": "01937f8e-1c2c-7b12-a8a6-123456789abc",
  "eventType": "UserRegistered",
  "eventVersion": 1,
  "occurredAt": "2026-10-30T22:00:00Z",
  "producer": "auth-service",
  "aggregateType": "User",
  "aggregateId": "01937f8e-1c2c-7b12-a8a6-123456789abc",
  "correlationId": "8d3a9c51-5b03-4d8d-a9b7-123456789abc",
  "data": {
    "userId": "01937f8e-1c2c-7b12-a8a6-123456789abc",
    "email": "user@example.com",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```

## Fields

| Field           | Type        | Required    | Description                                   |
|-----------------|-------------|-------------|-----------------------------------------------|
| `eventId`       | UUID        | Yes         | Unique identifier of the event.               |
| `eventType`     | string      | Yes         | Event name.                                   |
| `eventVersion`  | integer     | Yes         | Contract version.                             |
| `occurredAt`    | date-time   | Yes         | Moment when the event occurred, in UTC.       |
| `producer`      | string      | Yes         | Service that produced the event.              |
| `aggregateType` | string      | Yes         | Type of the changed aggregate.                |
| `aggregateId`   | string      | Yes         | Public identifier of the aggregate.           |
| `correlationId` | UUID/string | Recommended | Identifier to follow a distributed operation. |
| `data`          | object      | Yes         | Specific data of the event.                   |

## Rules

- `eventId` must be unique for each occurrence;
- `occurredAt` must be in UTC and follow ISO-8601;
- `eventVersion` is the version of the payload, not the version of the publisher;
- do not include secrets or tokens;
- the consumer must validate `eventType` and `eventVersion` before processing `data`;
- the consumer must store `eventId` before or in the same transaction as the change being processed.