# Booking Service — Implementation Report

## Implemented

The repository now contains a new `services/booking-service` integrated with the existing Spring Boot 4.1.1, Java 21,
PostgreSQL and RabbitMQ conventions.

The service implements booking creation with mandatory REST idempotency, paginated listing, single-booking access,
cancellation, confirmation, rejection, completion and availability checks. The authenticated user is taken from the JWT
subject; clients cannot choose an arbitrary owner. The service validates the business, establishment, catalog service
and resource through the business-service HTTP API, propagating the caller JWT and applying connect/read timeouts.

The booking domain supports the transitions `PENDING -> CONFIRMED|REJECTED|CANCELLED` and
`CONFIRMED -> CANCELLED|COMPLETED`. Invalid transitions are rejected. Booking history is stored in the same transaction
as state changes.

PostgreSQL owns the final conflict protection through a `btree_gist` exclusion constraint over `[start_at, end_at)` for
each resource and active booking status. The application also performs an early overlap check to provide a useful error
before the database constraint is reached.

Each state change writes an event to a transactional outbox. The scheduled publisher uses RabbitMQ publisher confirms,
retry backoff and the existing global events exchange. Events exceeding the configured attempts are sent to the global
dead-letter exchange with routing key `booking.outbox.failed`.

## Infrastructure changes

The global init script now creates and grants the dedicated `booking_service` database. Both development and production
Compose files contain the new service, share the existing PostgreSQL and RabbitMQ containers, configure health checks
and pass the global JWT/RabbitMQ configuration. Development publishes the service at `http://localhost:8082`; inside
Docker it remains on port `8080`.

The global `.env.example` now contains `BOOKING_DB_NAME`, `BOOKING_DB_USERNAME`, `BOOKING_SERVICE_PORT`, the
business-service URL and booking outbox parameters. Add these values to the real `infrastructure/.env` before starting
the stack. If PostgreSQL is already using an existing volume, run the database creation manually or recreate the volume;
`/docker-entrypoint-initdb.d` scripts only run for a new PostgreSQL volume.

## Events

The service publishes `BookingCreated`, `BookingConfirmed`, `BookingCancelled`, `BookingCompleted` and `BookingRejected`
using routing keys `booking.created`, `booking.confirmed`, `booking.cancelled`, `booking.completed` and
`booking.rejected`. Payloads include event identity, version, aggregate identity, occurrence time, user identity and a
booking response snapshot. The event contract is documented in `docs/events/booking-service-v1.md`.

## Tests and validation

The booking-service was validated with:

```text
./mvnw -B clean test package
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

The auth-service and business-service also compiled successfully with Maven. Compose YAML was parsed successfully and
both Compose files contain the booking-service. Docker integration tests, PostgreSQL migration execution and live
RabbitMQ confirmation could not be run in this sandbox because the Docker CLI/daemon is not available here. They must be
executed on the development machine before treating the complete stack as production-validated.

## Explicit current limitations

The current business-service catalog does not expose opening hours, pauses, special closures or resource
capacity/parallelism. The booking-service therefore validates active catalog hierarchy and exclusive resource overlap,
but it does not invent opening-hours rules. The availability endpoint currently evaluates the requested interval; a
future catalog contract can add operating schedules and capacity rules.

The current catalog model exposes business ownership but not a formal operator-to-establishment association. `OPERATOR`
management is therefore restricted using business ownership until that association exists. The event consumer for
catalog changes is prepared as a future phase; current booking validation is synchronous through the business-service
REST client.

Integration, concurrency, security and Testcontainers tests remain the next quality step. The PostgreSQL exclusion
constraint is implemented, but a live concurrent-request test still needs to be executed against PostgreSQL.
