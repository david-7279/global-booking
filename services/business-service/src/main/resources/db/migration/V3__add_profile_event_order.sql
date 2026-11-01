ALTER TABLE user_profiles
    ADD COLUMN last_event_at TIMESTAMP WITH TIME ZONE;

UPDATE user_profiles
SET last_event_at = updated_at
WHERE last_event_at IS NULL;

ALTER TABLE user_profiles
    ALTER COLUMN last_event_at SET NOT NULL;
