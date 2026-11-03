# booking-service

Serviço responsável por reservas, estados, histórico, disponibilidade, idempotência REST e publicação de eventos através de outbox.

## Implementado

- `POST /api/bookings` com `Idempotency-Key` obrigatório.
- `GET /api/bookings` com paginação.
- `GET /api/bookings/{id}`.
- `POST /api/bookings/{id}/cancel`.
- `POST /api/bookings/{id}/confirm`.
- `POST /api/bookings/{id}/reject`.
- `POST /api/bookings/{id}/complete`.
- `GET /api/availability`.
- JWT compatível com o `auth-service`.
- Validação REST do catálogo através do `business-service`.
- Histórico transacional.
- Constraint PostgreSQL `EXCLUDE USING GIST` para impedir sobreposição de reservas ativas no mesmo recurso.
- Outbox com publisher confirms, backoff e encaminhamento para DLQ.

## Decisões e limitações atuais

O catálogo atual não expõe horários de funcionamento, pausas ou capacidade simultânea dos recursos. Por isso, esta primeira versão valida a hierarquia e o estado do catálogo e impede sobreposição exclusiva por recurso, mas não inventa regras de horário que ainda não existem no `business-service`. A consulta de disponibilidade retorna o intervalo solicitado e a sua disponibilidade atual.

A autorização de `OPERATOR` usa o `ownerUserId` do business. Uma associação formal operador-estabelecimento ainda não existe no catálogo; quando esse modelo for criado, o cliente deve ser ajustado para validar esse âmbito.

## Execução

```bash
./mvnw -B clean test package
```

Com Compose, use o `.env` global em `infrastructure/.env` e o Compose da raiz do projeto.
