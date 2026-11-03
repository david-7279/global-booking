CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    business_id UUID NOT NULL,
    establishment_id UUID NOT NULL,
    booking_service_id UUID NOT NULL,
    resource_id UUID NOT NULL,
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL,
    notes VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT bookings_valid_period CHECK (end_at > start_at)
);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_resource_period ON bookings(resource_id, start_at, end_at);
CREATE INDEX idx_bookings_status ON bookings(status);
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlapping_periods EXCLUDE USING GIST (resource_id WITH =, tstzrange(start_at, end_at, '[)') WITH &&) WHERE (status IN ('PENDING', 'CONFIRMED'));

CREATE TABLE booking_history (
    id UUID PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id),
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    actor_id UUID NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reason VARCHAR(500)
);
CREATE INDEX idx_booking_history_booking_id ON booking_history(booking_id, occurred_at);

CREATE TABLE idempotency_records (
    idempotency_key VARCHAR(200) PRIMARY KEY,
    user_id UUID NOT NULL,
    request_hash VARCHAR(64) NOT NULL,
    booking_id UUID NOT NULL REFERENCES bookings(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE outbox_events (
    id UUID PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    routing_key VARCHAR(150) NOT NULL,
    aggregate_id UUID NOT NULL,
    payload TEXT NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    dead_lettered_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT
);
CREATE INDEX idx_booking_outbox_pending ON outbox_events(published_at, dead_lettered_at, next_attempt_at);
