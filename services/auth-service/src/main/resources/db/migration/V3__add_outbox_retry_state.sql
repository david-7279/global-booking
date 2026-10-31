-- =========================================================
-- V3 - Add Outbox Retry State
-- =========================================================

-- =========================================================
-- Add Outbox Retry State
-- =========================================================
ALTER TABLE outbox_events
    ADD COLUMN next_attempt_at TIMESTAMP WITH TIME ZONE;

-- =========================================================
-- Add DEAD_LETTERED_AT column to outbox_events table
-- =========================================================
ALTER TABLE outbox_events
    ADD COLUMN dead_lettered_at TIMESTAMP WITH TIME ZONE;

-- =========================================================
-- Update existing records to set next_attempt_at to published_at or occurred_at
-- =========================================================
UPDATE outbox_events
SET next_attempt_at = COALESCE(published_at, occurred_at)
WHERE next_attempt_at IS NULL;

-- =========================================================
-- Add NOT NULL constraint to next_attempt_at
-- =========================================================
ALTER TABLE outbox_events
    ALTER COLUMN next_attempt_at SET NOT NULL;

-- =========================================================
-- Indexes for outbox_events
-- =========================================================
CREATE INDEX idx_outbox_events_ready_to_publish
    ON outbox_events (next_attempt_at, occurred_at, id) WHERE published_at IS NULL
      AND dead_lettered_at IS NULL;
