CREATE TABLE businesses
(
    id            UUID PRIMARY KEY,
    owner_user_id UUID                     NOT NULL,
    name          VARCHAR(160)             NOT NULL,
    description   VARCHAR(1000),
    status        VARCHAR(30)              NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_businesses_owner_user_id ON businesses (owner_user_id);

CREATE TABLE establishments
(
    id          UUID PRIMARY KEY,
    business_id UUID                     NOT NULL REFERENCES businesses (id),
    name        VARCHAR(160)             NOT NULL,
    address     VARCHAR(500),
    timezone    VARCHAR(80)              NOT NULL,
    status      VARCHAR(30)              NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at  TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_establishments_business_id ON establishments (business_id);

CREATE TABLE booking_services
(
    id               UUID PRIMARY KEY,
    establishment_id UUID                     NOT NULL REFERENCES establishments (id),
    name             VARCHAR(160)             NOT NULL,
    description      VARCHAR(1000),
    duration_minutes INTEGER                  NOT NULL,
    price_cents      BIGINT                   NOT NULL,
    currency         CHAR(3)                  NOT NULL,
    status           VARCHAR(30)              NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at       TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_booking_services_establishment_id ON booking_services (establishment_id);

CREATE TABLE resources
(
    id               UUID PRIMARY KEY,
    establishment_id UUID                     NOT NULL REFERENCES establishments (id),
    name             VARCHAR(160)             NOT NULL,
    resource_type    VARCHAR(80)              NOT NULL,
    capacity         INTEGER                  NOT NULL,
    status           VARCHAR(30)              NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at       TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_resources_establishment_id ON resources (establishment_id);