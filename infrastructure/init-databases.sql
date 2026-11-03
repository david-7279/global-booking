CREATE DATABASE auth_service;
CREATE DATABASE business_service;
CREATE DATABASE booking_service;

GRANT ALL PRIVILEGES ON DATABASE auth_service TO globalbooking;
GRANT ALL PRIVILEGES ON DATABASE business_service TO globalbooking;
GRANT ALL PRIVILEGES ON DATABASE booking_service TO globalbooking;
