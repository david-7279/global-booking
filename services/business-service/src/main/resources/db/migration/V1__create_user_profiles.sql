CREATE TABLE user_profiles
(
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL UNIQUE,
    email       VARCHAR(254) NOT NULL,
    username    VARCHAR(120),
    role        VARCHAR(50) NOT NULL,
    status      VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at  TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_user_profiles_status
    ON user_profiles (status);
