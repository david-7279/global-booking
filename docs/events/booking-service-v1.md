# Booking events v1

The booking service publishes the following routing keys on `global-booking.events`:

- `booking.created`
- `booking.confirmed`
- `booking.cancelled`
- `booking.completed`
- `booking.rejected`

Each payload contains `eventId`, `eventType`, `eventVersion`, `aggregateId`, `occurredAt`, `userId` and a serialized
booking response in `data`. Events are persisted in the booking outbox in the same transaction as the booking and
history change. Consumers must treat delivery as at-least-once and deduplicate by `eventId`.
