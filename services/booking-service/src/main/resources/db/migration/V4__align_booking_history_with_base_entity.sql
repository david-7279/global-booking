-- Align booking_history with the shared BaseEntity mapping (created_at, updated_at).
-- Idempotent: safe to run on databases where part of the alignment already exists.

ALTER TABLE booking_history
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE booking_history
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

UPDATE booking_history
SET created_at = now()
WHERE created_at IS NULL;

UPDATE booking_history
SET updated_at = COALESCE(created_at, now())
WHERE updated_at IS NULL;

ALTER TABLE booking_history
    ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE booking_history
    ALTER COLUMN updated_at SET NOT NULL;