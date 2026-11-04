CREATE TABLE notifications
(
    id                UUID PRIMARY KEY,
    recipient_user_id UUID                     NOT NULL,
    recipient_email   VARCHAR(254),
    channel           VARCHAR(20)              NOT NULL,
    template_code     VARCHAR(60)              NOT NULL,
    template_version  INTEGER                  NOT NULL,
    locale            VARCHAR(10)              NOT NULL,
    subject           VARCHAR(255)             NOT NULL,
    body              TEXT                     NOT NULL,
    status            VARCHAR(20)              NOT NULL,
    source_event_id   UUID,
    source_event_type VARCHAR(80),
    correlation_id    VARCHAR(100),
    attempts          INTEGER                  NOT NULL DEFAULT 0,
    next_attempt_at   TIMESTAMP WITH TIME ZONE,
    sent_at           TIMESTAMP WITH TIME ZONE,
    failed_at         TIMESTAMP WITH TIME ZONE,
    read_at           TIMESTAMP WITH TIME ZONE,
    last_error        VARCHAR(1000),
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at        TIMESTAMP WITH TIME ZONE,
    CONSTRAINT ck_notifications_email_recipient
        CHECK (channel <> 'EMAIL' OR recipient_email IS NOT NULL),
    CONSTRAINT ck_notifications_attempts
        CHECK (attempts >= 0)
);

CREATE INDEX idx_notifications_recipient_created
    ON notifications (recipient_user_id, created_at DESC);

CREATE INDEX idx_notifications_recipient_unread
    ON notifications (recipient_user_id, read_at)
    WHERE channel = 'IN_APP';

CREATE INDEX idx_notifications_status_next_attempt
    ON notifications (status, next_attempt_at);

CREATE INDEX idx_notifications_source_event
    ON notifications (source_event_id);

-- Database-level guard for the consumer idempotency: an event may produce at most one notification per template and
-- channel, even if two deliveries are processed concurrently.
CREATE UNIQUE INDEX uk_notifications_source_event_template_channel
    ON notifications (source_event_id, template_code, channel)
    WHERE source_event_id IS NOT NULL;
