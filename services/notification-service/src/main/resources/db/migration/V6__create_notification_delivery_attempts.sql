CREATE TABLE notification_delivery_attempts
(
    id             BIGSERIAL PRIMARY KEY,
    notification_id UUID                     NOT NULL,
    attempt_number INTEGER                  NOT NULL,
    outcome        VARCHAR(20)              NOT NULL,
    error_message  VARCHAR(1000),
    attempted_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_notification_delivery_attempts_notification
        FOREIGN KEY (notification_id) REFERENCES notifications (id) ON DELETE CASCADE,
    CONSTRAINT ck_notification_delivery_attempts_number CHECK (attempt_number >= 1)
);

CREATE INDEX idx_notification_delivery_attempts_notification
    ON notification_delivery_attempts (notification_id, attempted_at DESC);
