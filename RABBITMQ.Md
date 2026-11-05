## Fase 3 — Outbox no auth-service

* Criar outbox_events.
* Criar entidade JPA.
* Criar repository.
* Criar evento UserRegistered.
* Gravar o evento na mesma transação do utilizador.
* Criar publisher relay.
* Configurar Spring AMQP.
* Ativar publisher confirms.
* Implementar retries e backoff.
* Marcar eventos publicados apenas depois da confirmação.

## Fase 4 — Primeiro consumer

Só depois deve ser criado um consumer real, provavelmente no próximo serviço.
O consumer deve ter:

* queue própria;
* binding próprio;
* acknowledgement manual;
* tabela de mensagens processadas ou mecanismo equivalente;
* idempotência;
* retry;
* dead-letter queue.

## Criar a queue

Na secção **Add a new queue**, usa:

```text
Virtual host: global-booking
Type: Default for virtual host
Name: debug.auth-events
Durability: Durable
Arguments: nenhum
```

Deixa os **Arguments vazios**.

Depois clica em:

```text
Add queue
```

## Criar o binding

Depois de criares a queue:

1. Abre `debug.auth-events`;
2. Desce até **Bindings**;
3. Em **From exchange**, seleciona:

```text
global-booking.events
```

4. Em **Routing key**, coloca:

```text
auth.user.registered
```

5. Clica em **Bind** ou **Add binding**.

O resultado esperado será:

```text
global-booking.events
        │
        └── auth.user.registered
                │
                ▼
        debug.auth-events
```

## Como deve aparecer na queue

Depois de criares o binding, a queue deverá mostrar algo semelhante a:

```text
Bindings:
  From exchange: global-booking.events
  Routing key: auth.user.registered
```

## O que são os argumentos da queue?

Os argumentos são usados para configurações especiais, como:

```text
x-dead-letter-exchange
x-dead-letter-routing-key
x-message-ttl
x-max-length
```

Por exemplo, para uma queue real com dead-letter exchange:

```text
Argument:
  x-dead-letter-exchange = global-booking.events.dlx
```

Mas para a queue de teste `debug.auth-events`, não precisas de argumentos.

## Teste final

Depois de criares a queue e o binding:

1. Cria um novo utilizador;
2. Abre `debug.auth-events`;
3. Vai a **Get messages**;
4. Usa:

```text
Messages: 1
Requeue: true
```

5. Clica em **Get Message (s)**.