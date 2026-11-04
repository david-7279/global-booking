-- Align legacy tables with the shared BaseEntity mapping.
-- The statements are idempotent so an installation that already contains
-- part of the alignment can be upgraded safely.

CREATE
EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE idempotency_records
    ADD COLUMN IF NOT EXISTS id UUID;

UPDATE idempotency_records
SET id = gen_random_uuid()
WHERE id IS NULL;

ALTER TABLE idempotency_records
    ALTER COLUMN id SET NOT NULL;

ALTER TABLE idempotency_records
DROP
CONSTRAINT IF EXISTS idempotency_records_pkey;

ALTER TABLE idempotency_records
    ADD CONSTRAINT idempotency_records_pkey PRIMARY KEY (id);

ALTER TABLE idempotency_records
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

UPDATE idempotency_records
SET updated_at = created_at
WHERE updated_at IS NULL;

ALTER TABLE idempotency_records
    ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE idempotency_records
    ADD CONSTRAINT uk_idempotency_records_key_user UNIQUE (idempotency_key, user_id);

ALTER TABLE outbox_events
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE outbox_events
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

UPDATE outbox_events
SET created_at = occurred_at
WHERE created_at IS NULL;

UPDATE outbox_events
SET updated_at = occurred_at
WHERE updated_at IS NULL;

ALTER TABLE outbox_events
    ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE outbox_events
    ALTER COLUMN updated_at SET NOT NULL;
