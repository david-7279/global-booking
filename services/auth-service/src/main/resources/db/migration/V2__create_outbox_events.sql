-- =========================================================
-- V2 - Create Outbox Events Schema
-- =========================================================

CREATE TABLE outbox_events
(
    id             UUID PRIMARY KEY,
    event_type     VARCHAR(100) NOT NULL,
    routing_key    VARCHAR(200) NOT NULL,
    payload        JSONB NOT NULL,
    occurred_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at   TIMESTAMP WITH TIME ZONE,
    attempts       INTEGER NOT NULL DEFAULT 0,
    last_error     TEXT,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- Outbox Events INDEXES
-- =========================================================

CREATE INDEX idx_outbox_events_pending
    ON outbox_events (occurred_at, id)
    WHERE published_at IS NULL;