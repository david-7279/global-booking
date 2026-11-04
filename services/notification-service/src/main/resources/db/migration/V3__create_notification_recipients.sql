CREATE TABLE notification_recipients
(
    id             UUID PRIMARY KEY,
    user_id        UUID                     NOT NULL UNIQUE,
    email          VARCHAR(254)             NOT NULL,
    username       VARCHAR(120),
    account_status VARCHAR(50)              NOT NULL,
    locale         VARCHAR(10)              NOT NULL,
    last_event_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at     TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notification_recipients_account_status
    ON notification_recipients (account_status);
