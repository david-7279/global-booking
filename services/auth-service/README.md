# Auth Service

Authentication and authorization microservice for the Global Booking platform, responsible for managing user identity,
authentication, and access control.

## Overview

The Auth Service is responsible for securely managing authentication within Global Booking.

It handles user registration, login, JWT-based authentication, authorization, and user roles. It operates independently
from the other microservices and owns its authentication-related data.

## Key Features

* User registration
* User authentication
* JWT access tokens
* Refresh token management
* Role-based authorization
* Password hashing
* Input validation
* PostgreSQL persistence
* Health checks and application metrics

## Tech Stack

* Java 21
* Spring Boot 4.1.1
* Spring Security
* Spring Data JPA
* PostgreSQL
* Maven
* Lombok
* Spring Boot Actuator
* Docker

## Prerequisites

* Java 21+
* Maven 3.9+
* PostgreSQL 16+
* Docker (optional)

## Configuration

The service uses Spring profiles for environment-specific configuration.

Development configuration:

```yaml
spring:
  profiles:
    active: dev
```

The development environment is configured in:

```text
src/main/resources/application-dev.yaml
```

Sensitive values such as JWT secrets should be provided through environment variables in production.

## Installation & Getting Started

Install dependencies and build the service:

```bash
./mvnw clean install
```

Start the application:

```bash
./mvnw spring-boot:run
```

The service runs by default on:

```text
http://localhost:8080
```

## Usage

The Auth Service exposes authentication endpoints that will be consumed by the API Gateway and other parts of the Global
Booking platform.

The expected authentication flow is:

```text
Client
   ↓
API Gateway
   ↓
Auth Service
   ↓
Validate Credentials
   ↓
Generate JWT
   ↓
Client
```

Authenticated requests can then use the JWT to access protected resources through the API Gateway.

## Project Structure

```text
auth-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/globalbooking/auth/
│   │   └── resources/
│   │       ├── application.yaml
│   │       └── application-dev.yaml
│   │
│   └── test/
│
├── Dockerfile
├── pom.xml
└── README.md
```

## Configuration

The service uses Spring profiles.

| Profile | File                   | Description             | 
|---------|------------------------|-------------------------|
| `dev`   | `application-dev.yaml` | Development environment |

Sensitive values (JWT secret, DB credentials) should be provided via environment variables in production.

## Default development values

| Variable      | Default Value                                                     |
|---------------|-------------------------------------------------------------------|
| `DB_HOST`     | `localhost` (or `postgres` inside Docker)                         |
| `DB_PORT`     | `5432`                                                            |
| `DB_NAME`     | `auth_service`                                                    |
| `DB_USERNAME` | `globalbooking`                                                   |
| `DB_PASSWORD` | `secret`                                                          |
| `JWT_SECRET`  | `dev-secret-change-me-in-production-please-use-at-least-256-bits` |

## Running with Docker Compose (recommended)

From the `infrastructure/` folder:

```bash
# Start infrastructure + auth-service
docker compose -f docker-compose-dev.yml up -d --build

# Check status
docker compose -f docker-compose-dev.yml ps

# Follow logs
docker compose -f docker-compose-dev.yml logs -f auth-service

# Stop everything
docker compose -f docker-compose-dev.yml down

# Stop and remove volumes (reset databases)
docker compose -f docker-compose-dev.yml down -v
```

### Health check

```bash
curl http://localhost:8080/actuator/health
```

Expected response:

```text
JSON{"groups":["liveness","readiness"],"status":"UP"}
```

## Running locally (without Docker for the service)

1. Start only the database:

```bash
cd infrastructure 
docker compose -f docker-compose-dev.yml up -d postgres
```

2. Run the service:

```bash
cd services/auth-service 
./mvnw spring-boot:run
```

3. The service will be available at:

```text
http://localhost:8080
```

## Inspecting the database

```bash
# Enter psql
docker exec -it global-booking-postgres psql -U globalbooking -d auth_service

# Useful commands inside psql
\dt                          # list tables
\d users                     # describe table
SELECT * FROM users;         # query data
\q                           # quit
```

One-liner examples:

```bash
# List tables
docker exec -it global-booking-postgres \
  psql -U globalbooking -d auth_service -c "\dt"

# Query users (after creating the entity)
docker exec -it global-booking-postgres \
  psql -U globalbooking -d auth_service -c "SELECT * FROM users;"
```

## Build

```bash 
./mvnw clean package -DskipTests
```