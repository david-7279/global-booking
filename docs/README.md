# Event Contracts

This directory contains the integration-event contracts used by Global Booking. The contracts are transport-independent;
RabbitMQ is the current transport implementation.

## Common envelope

Every integration event must use the envelope defined in [envelope-v1.md](./envelope-v1.md). The event-specific payload
is stored in the `data` property and is validated against the schema matching `eventType` and `eventVersion`.

## Event naming conventions

| Field           | Convention                                         |
|-----------------|----------------------------------------------------|
| `eventType`     | Semantic PascalCase name, such as `UserRegistered` |
| `eventVersion`  | Integer contract version, starting at `1`          |
| `producer`      | Stable service name that produced the event        |
| `aggregateType` | Aggregate type, such as `User`                     |
| `aggregateId`   | Public identifier of the aggregate                 |
| `routingKey`    | RabbitMQ topic key, such as `auth.user.registered` |

The event name describes a fact that has already happened. Use past-tense names such as `UserRegistered`, not commands
such as `RegisterUser`.

## Defined auth-service events

| Event type          | Routing key                | Schema                                                            |
|---------------------|----------------------------|-------------------------------------------------------------------|
| `UserRegistered`    | `auth.user.registered`     | [user-registered-v1.json](./auth/user-registered-v1.json)         |
| `UserUpdated`       | `auth.user.updated`        | [user-updated-v1.json](./auth/user-updated-v1.json)               |
| `UserDeleted`       | `auth.user.deleted`        | [user-deleted-v1.json](./auth/user-deleted-v1.json)               |
| `UserStatusChanged` | `auth.user.status-changed` | [user-status-changed-v1.json](./auth/user-status-changed-v1.json) |

## Versioning policy

`eventVersion` is the version of the event payload contract, not the version of the producing service.

Backward-compatible changes, such as adding an optional field, may keep the current version. Breaking changes, such as
removing a required field, changing a field type, or changing its meaning, require a new version.

A new version must have a new schema file, for example:

```text
auth/user-registered-v2.json
```

Existing versions must remain readable by consumers for the period agreed by the platform team. Published event
contracts must not be changed retroactively.

## Exchange and routing

The current RabbitMQ exchange is:

```text
Name: global-booking.events
Type: topic
Durable: true
Auto-delete: false
```

The `auth-service` publishes to this exchange using the routing keys listed above. Producers publish events; consumers
own their queues and bindings.

A consumer that needs all auth user events may bind with:

```text
auth.user.*
```

A consumer that needs only registration events should bind with:

```text
auth.user.registered
```

## Registered consumers

| Consumer               | Queue                                 | Binding key   |
|------------------------|---------------------------------------|---------------|
| `notification-service` | `notification-service.auth-events`    | `auth.user.*` |
| `notification-service` | `notification-service.booking-events` | `booking.*`   |

The notification-service owns its full topology. Each consumer queue is durable and declares dead-letter arguments
pointing to `global-booking.events.dlx` with the `<queue>.unroutable` key. Delayed retries are implemented with durable
TTL queues named `<queue>.retry-<attempt>` (5 s, 30 s, 5 min), bound to the `global-booking.events.retry` exchange and
dead-lettered back to `global-booking.events` with the `<queue>.replay` key. The dead-letter queue `<queue>.dlq` is
bound
to the family pattern (`auth.user.*.failed`, `booking.*.failed`) plus `<queue>.unroutable`. The contract, headers and
state machine are documented in [notification-service-contract.md](../notification-service-contract.md).

## Published data policy

Events must contain only the data required by consumers. The following data must never be published:

- plaintext passwords or password hashes;
- access tokens or refresh tokens;
- JWT secrets;
- database or RabbitMQ credentials;
- internal database identifiers when a public identifier is available;
- unnecessary sensitive or personal data.

The `UserRegistered` event may contain the public user ID, email, role, and initial status. The complete user entity
must not be serialized into an event automatically.

## Delivery guarantee and idempotency

Events use at-least-once delivery. A consumer may receive the same event more than once because of broker redelivery,
publisher retries, consumer restarts, or network failures.

Consumers must be idempotent. Every consumer must use `eventId` as the unique event identity and must record successful
processing before acknowledging the message, preferably in the same database transaction as the consumer's business
change.

A consumer must not use `aggregateId` alone for deduplication because the same aggregate can produce multiple distinct
events.

## Retry policy

The standard retry schedule is:

|          Attempt |             Delay before retry |
|-----------------:|-------------------------------:|
| Initial delivery |                           None |
|          Retry 1 |                      5 seconds |
|          Retry 2 |                     30 seconds |
|          Retry 3 |                      5 minutes |
|    Final failure | Route to the dead-letter queue |

The retry count must be tracked using message headers and/or a persisted consumer-processing record. A consumer must not
retry indefinitely.

Transient failures, such as temporary database or network failures, may be retried. Permanent failures, such as an
invalid event schema or an unsupported event version, should be rejected and routed to the dead-letter flow without
repeated retries after the error is confirmed to be non-transient.

## Acknowledgement rules

Consumers use manual acknowledgements:

- acknowledge (`ack`) only after successful, idempotent processing;
- reject or negatively acknowledge with requeue for a transient failure that is still eligible for retry;
- reject or negatively acknowledge without requeue after the retry limit is reached;
- never acknowledge a message before the consumer's business transaction is committed;
- do not use unlimited requeue loops.

## Dead-letter policy

Failed messages are routed to:

```text
Dead-letter exchange: global-booking.events.dlx
Dead-letter routing key: <original-routing-key>.failed
Dead-letter queue: <consumer-name>.<event-family>.dlq
```

Example:

```text
Original routing key: auth.user.registered
Dead-letter routing key: auth.user.registered.failed
Dead-letter queue: notification-service.auth-events.dlq
```

Dead-letter messages must retain the original event body and include enough metadata to diagnose the failure, including
the original routing key, consumer name, failure reason, and retry count. Do not include passwords, tokens, or
credentials in failure metadata.

## Outbox requirement

A producer must use the Transactional Outbox pattern when the event represents a database change:

1. update the domain data;
2. write the event to the outbox in the same database transaction;
3. commit the transaction;
4. publish the outbox record to RabbitMQ;
5. mark the outbox record as published only after broker confirmation.

The outbox prevents a successful database transaction from losing its corresponding integration event when RabbitMQ is
temporarily unavailable.
