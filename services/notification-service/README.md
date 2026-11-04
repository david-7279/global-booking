# notification-service

Serviço responsável por transformar eventos de domínio em notificações para os utilizadores: histórico persistido,
caixa de entrada in-app, envio de email com retry e backoff, DLQ e templates versionados.

Stack: Java 21, Spring Boot 4, Spring Data JPA, PostgreSQL, Spring AMQP (RabbitMQ), Flyway e SMTP.

## Implementado

- **Consumo de eventos** de `auth.user.*` (auth-service) e `booking.*` (booking-service), com envelopes tipados e
  validação de versão.
- **Idempotência** com a tabela `processed_events`, chave composta `(event_id, consumer_name)`. As notificações e o
  registo de processamento são gravados na mesma transação.
- **Histórico** completo em `notifications` (canal, template, versão, locale, assunto, corpo, estado, tentativas,
  evento de origem, `correlation_id`).
- **Retry com backoff** em duas camadas: filas de retry com TTL (5s / 30s / 5min) para o consumo de eventos e backoff
  exponencial para o envio de email.
- **DLQ** `notification-service.*.dlq` alimentada por `global-booking.events.dlx` com a routing key
  `<routing-key>.failed`, mais auditoria em `dead_lettered_events` (payload original, motivo, tentativas).
- **Templates versionados** em `notification_templates`, com seed das versões 1 e 2 e resolução da versão mais recente
  por `code`/`channel`/`locale` (fallback para o locale padrão).
- **Envio de email** por SMTP (`SmtpEmailSender`) ou log (`LoggingEmailSender`) quando `MAIL_ENABLED=false`.
- **Caixa de entrada in-app** com contagem de não lidas e marcação de leitura.
- **Observabilidade**: Micrometer (`notifications_created_total`, `notifications_delivered_total`,
  `notification_events_dead_lettered_total`, `notification_events_retried_total`), logs estruturados com
  `notification_id`/`event_id` e health probes de liveness/readiness.

## Fluxo de eventos

```text
auth-service ── auth.user.* ──┐
                              ├─► global-booking.events ─► notification-service.{auth,booking}-events
booking-service ── booking.* ─┘                                   │
                                                                  ├─ ok ─► notifications + processed_events (ack)
                                                                  ├─ transitório ─► *.retry-N (TTL) ─► replay (ack)
                                                                  └─ permanente/esgotado ─► events.dlx ─► *.dlq (ack)
```

Eventos tratados:

| Evento                                              | Canal          | Template               |
|-----------------------------------------------------|----------------|------------------------|
| `UserRegistered`                                    | email          | `USER_REGISTERED`      |
| `UserUpdated`                                       | —              | apenas projeção        |
| `UserStatusChanged`                                 | email          | `USER_STATUS_CHANGED`  |
| `UserDeleted`                                       | email          | `USER_DELETED`         |
| `BookingCreated`                                    | email + in-app | `BOOKING_CREATED`      |
| `BookingConfirmed`                                  | email + in-app | `BOOKING_CONFIRMED`    |
| `BookingCancelled`                                  | email + in-app | `BOOKING_CANCELLED`    |
| `BookingRejected`                                   | email + in-app | `BOOKING_REJECTED`     |
| `BookingCompleted`                                  | email + in-app | `BOOKING_COMPLETED`    |

A projeção `notification_recipients` guarda o email e o locale do utilizador a partir dos eventos de auth. Um evento de
booking que chegue antes do registo do utilizador é **retentado** (`RecipientNotReadyException`), porque a ordem entre
os dois serviços não é garantida.

## Endpoints

| Método | Rota                              | Descrição                                        |
|--------|-----------------------------------|--------------------------------------------------|
| GET    | `/api/notifications`              | Lista paginada (filtros `status`, `channel`, `unreadOnly`) |
| GET    | `/api/notifications/unread-count` | Contagem de notificações in-app não lidas        |
| GET    | `/api/notifications/{id}`         | Detalhe                                          |
| GET    | `/api/notifications/{id}/attempts`| Histórico de tentativas de entrega               |
| POST   | `/api/notifications/{id}/read`    | Marca como lida (apenas in-app)                  |
| POST   | `/api/notifications/{id}/retry`   | Reenfileira entrega (apenas ADMIN)               |
| GET    | `/api/notification-templates`     | Catálogo de templates (ADMIN/SUPERVISOR)         |
| POST   | `/api/notification-templates`     | Regista nova versão de template (ADMIN)          |

Contrato detalhado: [docs/notification-service-contract.md](../../docs/notification-service-contract.md).

## Configuração

Variáveis principais (ver `infrastructure/.env.example`):

| Variável                                     | Default                  | Descrição                                        |
|----------------------------------------------|--------------------------|--------------------------------------------------|
| `DB_HOST` / `DB_PORT` / `DB_NAME`            | —                        | Base de dados `notification_service`             |
| `RABBITMQ_*`                                 | —                        | Credenciais e vhost                              |
| `NOTIFICATION_PREFETCH`                      | `10`                     | Mensagens em voo por consumidor                  |
| `NOTIFICATION_RETRY_DELAYS_MS`               | `5000,30000,300000`      | Delays das filas de retry                        |
| `NOTIFICATION_RETRY_MAX_ATTEMPTS`            | `3`                      | Tentativas antes da DLQ                          |
| `NOTIFICATION_DISPATCH_DELAY_MS`             | `2000`                   | Intervalo do dispatcher de entregas              |
| `NOTIFICATION_MAX_DELIVERY_ATTEMPTS`         | `3`                      | Tentativas de envio de email                     |
| `NOTIFICATION_DELIVERY_INITIAL_BACKOFF_MS`   | `5000`                   | Backoff inicial do email                         |
| `NOTIFICATION_DELIVERY_MAX_BACKOFF_MS`       | `300000`                 | Backoff máximo do email                          |
| `MAIL_ENABLED`                               | `false`                  | `true` usa SMTP; `false` apenas regista o email  |
| `MAIL_HOST` / `MAIL_PORT`                    | `localhost` / `1025`     | Servidor SMTP                                    |
| `MAIL_FROM` / `MAIL_FROM_NAME`               | `no-reply@global-booking.local` | Remetente                                 |

## Execução

Com a stack completa (inclui PostgreSQL, RabbitMQ e Mailpit):

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml up -d --build notification-service
```

Isolado, com Maven:

```bash
cd services/notification-service
DB_HOST=localhost DB_PORT=5433 DB_NAME=notification_service DB_USERNAME=globalbooking DB_PASSWORD=... \
RABBITMQ_HOST=localhost RABBITMQ_USERNAME=... RABBITMQ_PASSWORD=... RABBITMQ_VHOST=global-booking \
JWT_SECRET=... MAIL_ENABLED=false ./mvnw spring-boot:run
```

Emails de desenvolvimento ficam disponíveis em `http://localhost:8025` (Mailpit).

## Testes

```bash
./mvnw test
```

Cobrem o agregado `Notification` (transições de estado e retry), o renderizador de templates, o composer, a idempotência
do consumo e as políticas de backoff.

## Limitações atuais

- O envio de email acontece dentro da transação da tentativa; para volumes maiores o padrão correto é uma outbox de
  entrega com worker dedicado.
- Os templates suportam substituição de variáveis (`{{nome}}`), não lógica condicional.
- Ainda não existe endpoint público para reprocessar mensagens da DLQ; o replay é feito pelo RabbitMQ Management.
- `notification_recipients` é uma projeção: perde-se se a base for recriada e é reconstruída pelos eventos de auth
  seguintes.
