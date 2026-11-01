CREATE TABLE business_audit_events
(
    id             BIGSERIAL PRIMARY KEY,
    correlation_id UUID,
    actor_user_id  UUID,
    action         VARCHAR(100)             NOT NULL,
    resource_type  VARCHAR(80)              NOT NULL,
    resource_id    UUID,
    occurred_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    details        JSONB
);

CREATE INDEX idx_business_audit_events_resource
    ON business_audit_events (resource_type, resource_id);
