-- Align operating_hours with the shared BaseEntity mapping (created_at, updated_at).
-- Idempotent: safe to run on databases where part of the alignment already exists.

ALTER TABLE operating_hours
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE operating_hours
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

UPDATE operating_hours
SET created_at = now()
WHERE created_at IS NULL;

UPDATE operating_hours
SET updated_at = COALESCE(created_at, now())
WHERE updated_at IS NULL;

ALTER TABLE operating_hours
    ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE operating_hours
    ALTER COLUMN updated_at SET NOT NULL;