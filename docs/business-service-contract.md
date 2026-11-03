# Business Service Contract v1

## Ownership and roles

The JWT `sub` claim is the authenticated `user_id`. The `role` claim is one of `USER`, `OPERATOR`, `SUPERVISOR`, or
`ADMIN`.

| Operation                                | USER |       OPERATOR | SUPERVISOR | ADMIN |
|------------------------------------------|-----:|---------------:|-----------:|------:|
| Read own businesses                      |   no |            yes |        yes |   yes |
| Create business                          |   no |            yes |        yes |   yes |
| Modify own business                      |   no |            yes |        yes |   yes |
| Modify any business                      |   no |             no |        yes |   yes |
| Manage establishments/services/resources |   no | owned business |        any |   any |

## Entity contracts

### Business

```json
{
  "id": "uuid",
  "ownerUserId": "uuid",
  "name": "string, 1..160",
  "description": "string, max 1000",
  "status": "ACTIVE|DELETED",
  "createdAt": "instant",
  "updatedAt": "instant"
}
```

### Establishment

```json
{
  "id": "uuid",
  "businessId": "uuid",
  "name": "string, 1..160",
  "address": "string, max 500",
  "timezone": "IANA timezone, max 80",
  "status": "ACTIVE|DELETED"
}
```

### BookingService

```json
{
  "id": "uuid",
  "establishmentId": "uuid",
  "name": "string, 1..160",
  "description": "string, max 1000",
  "durationMinutes": "1..1440",
  "priceCents": "integer >= 0",
  "currency": "ISO-4217 uppercase code",
  "status": "ACTIVE|DELETED"
}
```

### Resource

```json
{
  "id": "uuid",
  "establishmentId": "uuid",
  "name": "string, 1..160",
  "resourceType": "string, 1..80",
  "capacity": "1..100000",
  "status": "ACTIVE|DELETED"
}
```

## Event ordering

`UserProfile.last_event_at` stores the latest accepted `occurredAt`. An event with an older or equal timestamp is
ignored, while its `event_id` is still recorded in `processed_events`. This prevents delayed `UserUpdated` or
`UserStatusChanged` deliveries from reverting newer state.
