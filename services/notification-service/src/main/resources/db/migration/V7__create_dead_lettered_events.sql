CREATE TABLE dead_lettered_events
(
    id               BIGSERIAL PRIMARY KEY,
    event_id         UUID,
    consumer_name    VARCHAR(120)             NOT NULL,
    event_type       VARCHAR(80),
    source_queue     VARCHAR(150),
    routing_key      VARCHAR(150),
    payload          TEXT                     NOT NULL,
    failure_reason   VARCHAR(1000),
    retry_count      INTEGER                  NOT NULL DEFAULT 0,
    dead_lettered_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_dead_lettered_events_event_id
    ON dead_lettered_events (event_id);

CREATE INDEX idx_dead_lettered_events_dead_lettered_at
    ON dead_lettered_events (dead_lettered_at DESC);
