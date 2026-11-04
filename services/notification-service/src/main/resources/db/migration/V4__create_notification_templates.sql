CREATE TABLE notification_templates
(
    id               UUID PRIMARY KEY,
    code             VARCHAR(60)              NOT NULL,
    channel          VARCHAR(20)              NOT NULL,
    locale           VARCHAR(10)              NOT NULL,
    version          INTEGER                  NOT NULL,
    subject_template VARCHAR(255)             NOT NULL,
    body_template    TEXT                     NOT NULL,
    active           BOOLEAN                  NOT NULL DEFAULT TRUE,
    description      VARCHAR(500),
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at       TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_notification_templates_identity UNIQUE (code, channel, locale, version),
    CONSTRAINT ck_notification_templates_version CHECK (version >= 1)
);

CREATE INDEX idx_notification_templates_lookup
    ON notification_templates (code, channel, locale, active, version DESC);
