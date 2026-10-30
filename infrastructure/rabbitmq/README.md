# RabbitMQ Topology

This directory documents the RabbitMQ topology used by Global Booking. The event payload contracts are maintained
separately under `docs/events/`.

## Virtual host

```
Name: global-booking
```

The virtual host must match the value configured in `infrastructure/.env`:

```
RABBITMQ_VHOST=global-booking
```

## Main event exchange

```
Name: global-booking.events
Type: topic
Durable: true
Auto-delete: false
Internal: false
```

The exchange receives integration events from producers such as `auth-service`.

Current auth-service routing keys:

```
auth.user.registered
auth.user.updated
auth.user.deleted
auth.user.status-changed
```

## Dead-letter exchange

```
Name: global-booking.events.dlx
Type: topic
Durable: true
Auto-delete: false
Internal: false
```

The dead-letter exchange receives messages that cannot be processed after the configured retry limit, or messages
rejected because they contain a permanent error.

## Queues

Queues belong to consumer services. Producers must not create a shared queue for all consumers. Each consumer must have
its own durable queue so that acknowledgement and retry state remain isolated.

No consumer queue is required while no consumer service exists. When the first consumer is added, use a name that
identifies both the consumer and the event family.

Example:

```
Queue: notification-service.auth-events
Durable: true
Auto-delete: false
Binding: auth.user.*
Dead-letter queue: notification-service.auth-events.dlq
```

A consumer that only needs registration events should use:

```
Binding: auth.user.registered
```

## Dead-letter queue convention

For a consumer named `<consumer-name>` and an event family named `<event-family>`:

```
Queue: <consumer-name>.<event-family>
Dead-letter queue: <consumer-name>.<event-family>.dlq
```

Example:

```
Queue: notification-service.auth-events
Dead-letter queue: notification-service.auth-events.dlq
```

The queue should be configured with:

```
x-dead-letter-exchange: global-booking.events.dlx
```

The dead-letter exchange should receive failed messages with this routing-key convention:

```
<original-routing-key>.failed
```

Example:

```
Original: auth.user.registered
Dead-letter: auth.user.registered.failed
```

## Retry policy

The standard retry schedule is:

| Attempt          | Delay             |
|------------------|-------------------|
| Initial delivery | None              |
| Retry 1          | 5 seconds         |
| Retry 2          | 30 seconds        |
| Retry 3          | 5 minutes         |
| Final failure    | Dead-letter queue |

Retry queues are consumer-specific. A retry implementation may use TTL queues with dead-letter routing or another
approved delayed-message mechanism. It must preserve the original event body and routing key.

Suggested queue naming for a consumer:

```
<consumer-name>.<event-family>.retry.5s
<consumer-name>.<event-family>.retry.30s
<consumer-name>.<event-family>.retry.5m
<consumer-name>.<event-family>.dlq
```

The retry count must be carried in a message header and/or persisted by the consumer. Retry queues must not create an
unlimited requeue loop.

## Consumer acknowledgement behavior

Consumers must use manual acknowledgements:

- `ack` only after successful business processing and commit;
- `nack(requeue=true)` only for an eligible transient failure;
- `nack(requeue=false)` when the message is permanently invalid or has reached the retry limit;
- never acknowledge before the business transaction is complete;
- route final failures to the dead-letter flow.

Consumers must be idempotent and deduplicate using the event envelope's `eventId`.

## Durability and persistence

The exchange, queues, and messages must be durable where business events must survive a broker restart. The RabbitMQ
data directory is persisted by the Docker volume:

```
rabbitmq-data:/var/lib/rabbitmq
```

The development Compose publishes the management UI on:

```
http://localhost:15672
```

The AMQP port published for local tools is:

```
localhost:5672
```

Containers must connect through the Docker DNS name:

```
rabbitmq:5672
```

Do not use `localhost:5672` from inside another container.

## Configuration source

RabbitMQ credentials and host ports come from the single global environment file:

```
infrastructure/.env
```

Expected variables:

```
RABBITMQ_USER=globalbooking
RABBITMQ_PASSWORD=<strong-password>
RABBITMQ_VHOST=global-booking
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672
```

The real `.env` file must not be committed or distributed.

## Definitions file

If `definitions.json` is used, it must be mounted into the container and RabbitMQ must be explicitly configured to load
it. Simply storing the file in this directory does not apply the topology automatically.

Topology definitions should initially contain only shared exchanges if no consumer exists. Add queues, bindings, retry
queues, and dead-letter queues when the corresponding consumer service is implemented.

## Operational rules

- use durable exchanges and queues;
- use explicit acknowledgements;
- keep queues consumer-specific;
- do not retry permanently invalid messages indefinitely;
- retain dead-letter messages for diagnosis and controlled replay;
- never place credentials, passwords, or tokens in event bodies or failure metadata;
- document every new exchange, queue, binding, and routing key before implementation.