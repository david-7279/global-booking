CREATE TABLE processed_events
(
    event_id      UUID                     NOT NULL,
    consumer_name VARCHAR(120)             NOT NULL,
    processed_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (event_id, consumer_name)
);

CREATE INDEX idx_processed_events_processed_at
    ON processed_events (processed_at);
