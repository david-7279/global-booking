ALTER TABLE bookings
    ADD COLUMN allocation_slot INTEGER NOT NULL DEFAULT 0;

ALTER TABLE bookings DROP CONSTRAINT bookings_no_overlapping_periods;

ALTER TABLE bookings
    ADD CONSTRAINT bookings_no_overlapping_periods EXCLUDE USING GIST (
    resource_id WITH =,
    allocation_slot WITH =,
    tstzrange(start_at, end_at, '[)') WITH &&
) WHERE (status IN ('PENDING', 'CONFIRMED'));

CREATE INDEX idx_bookings_resource_slot_period ON bookings (resource_id, allocation_slot, start_at, end_at);

CREATE TABLE operating_hours
(
    id               UUID PRIMARY KEY,
    establishment_id UUID        NOT NULL,
    day_of_week      VARCHAR(10) NOT NULL,
    opens_at         TIME        NOT NULL,
    closes_at        TIME        NOT NULL,
    break_start      TIME,
    break_end        TIME,
    CONSTRAINT uk_operating_hours_establishment_day UNIQUE (establishment_id, day_of_week),
    CONSTRAINT operating_hours_valid_range CHECK (closes_at > opens_at),
    CONSTRAINT operating_hours_valid_break CHECK (break_start IS NULL OR break_end IS NULL OR break_end > break_start)
);

CREATE INDEX idx_operating_hours_establishment ON operating_hours (establishment_id);
