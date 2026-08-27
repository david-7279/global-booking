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
* Environment-based configuration (dev/prod)
* Secure defaults for production

## Tech Stack

* Java 21
* Spring Boot 4.1.1
* Spring Security
* Spring Data JPA
* PostgreSQL
* Maven
* Lombok
* Spring Boot Actuator
* Docker & Docker Compose

## Prerequisites

* Java 21+
* Maven 3.9+
* PostgreSQL 16+ (optional - Docker Compose includes it)
* Docker & Docker Compose (recommended)

## Project Structure

```text
auth-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/globalbooking/auth/
│   │   │       ├── common/
│   │   │       │   ├── error/              # Global API error handling
│   │   │       │   └── exception/          # Application-specific exceptions
│   │   │       ├── dto/
│   │   │       │   ├── request/             # Incoming API request DTOs
│   │   │       │   └── response/            # Outgoing API response DTOs
│   │   │       ├── domain/                  # Core domain entities and enums
│   │   │       └── repository/              # Data persistence and queries
│   │   │
│   │   └── resources/
│   │       ├── application.yaml             # Base configuration
│   │       ├── application-dev.yaml         # Development configuration
│   │       ├── application-prod.yaml        # Production configuration
│   │       └── db/
│   │           └── migration/               # Flyway database migrations
│   │
│   └── test/                                # Unit and integration tests
│
├── Dockerfile                               # Multi-stage production-ready image
├── pom.xml                                  # Maven dependencies and build configuration
└── README.md                                # Service documentation
```

## Configuration

The Auth Service uses Spring profiles for environment-specific configuration. Each environment has its own secure
defaults.

### Configuration Files

| Profile | File                    | Description                                 | Use Case          |
|---------|-------------------------|---------------------------------------------|-------------------|
| `dev`   | `application-dev.yaml`  | Development environment with debug settings | Local development |
| `prod`  | `application-prod.yaml` | Production environment with secure defaults | Cloud deployment  |

### Environment Variables

The service requires specific environment variables for each profile:

#### Development Environment

```bash
# Required for dev profile
export SPRING_PROFILES_ACTIVE=dev
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=auth_service
export DB_USERNAME=globalbooking
export DB_PASSWORD=secret
export JWT_SECRET=dev-secret-256bits-min-length-for-HS256-algorithm-do-not-use-in-prod
```

#### Production Environment

```bash
# Required for prod profile - DO NOT use development defaults
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=postgres.prod.example.com
export DB_PORT=5432
export DB_NAME=auth_service
export DB_USERNAME=<secure-username>
export DB_PASSWORD=<secure-password>
export JWT_SECRET=<generated-256bit-base64-secret>
export DB_POOL_SIZE=20
export DB_POOL_MIN_IDLE=5
export CORS_ALLOWED_ORIGINS=https://booking.example.com,https://www.example.com
```

### Profile Defaults

**Development** (`application-dev.yaml`):

- `ddl-auto: create-drop` - Auto-creates schema, drops on shutdown
- `show-sql: false` - SQL logging disabled for performance
- `CORS`: Allows localhost:3000, localhost:5173, localhost:8080
- Logging: DEBUG level for development debugging

**Production** (`application-prod.yaml`):

- `ddl-auto: validate` - Only validates schema, no auto-migrations
- `show-sql: false` - SQL logging disabled for security
- Connection pooling: 20 max, 5 min idle connections
- Health checks: Restricted to `/liveness` and `/readiness`
- Logging: Rotated files with 30-day retention, 1GB total cap
- CORS: Requires explicit environment variable configuration

## Installation & Getting Started

### Option 1: Docker Compose (Recommended)

The easiest way to run the entire development stack:

```bash
# From repository root
cd infrastructure

# Start everything (PostgreSQL + Auth Service)
docker compose -f docker-compose-dev.yml up -d --build

# Check status
docker compose -f docker-compose-dev.yml ps

# View logs
docker compose -f docker-compose-dev.yml logs -f auth-service

# Health check
curl http://localhost:8080/actuator/health/liveness

# Stop everything
docker compose -f docker-compose-dev.yml down

# Stop and reset databases
docker compose -f docker-compose-dev.yml down -v
```

### Option 2: Local Development (Without Docker)

For local development without Docker containers:

```bash
# 1. Start only the database
cd infrastructure
docker compose -f docker-compose-dev.yml up -d postgres

# 2. Navigate to service directory
cd ../services/auth-service

# 3. Install dependencies
./mvnw clean install

# 4. Run the service
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run 

# The service will be available at http://localhost:8080
```

### Option 3: Production Deployment

For production deployment:

```bash
# 1. Create secure .env file from template
cp .env.example .env

# 2. Edit .env with production values
nano .env
# - Set POSTGRES_PASSWORD to secure password
# - Set JWT_SECRET using: openssl rand -base64 32
# - Set CORS_ALLOWED_ORIGINS to your domain
# - Set SPRING_PROFILES_ACTIVE=prod

# 3. Deploy with Docker Compose
docker compose --env-file .env up -d --build

# 4. Verify health
curl http://localhost:8080/actuator/health/liveness
```

## Usage

### Authentication Flow

The Auth Service exposes authentication endpoints that are consumed by the API Gateway and other microservices:

```text
Client
   ↓
API Gateway
   ↓
Auth Service (8080)
   ↓
Validate Credentials
   ↓
Generate JWT
   ↓
Client
```

Authenticated requests use the JWT to access protected resources through the API Gateway.

### Health Check Endpoints

```bash
# Liveness probe (is service running?)
curl http://localhost:8080/actuator/health/liveness

# Readiness probe (is service ready to accept traffic?)
curl http://localhost:8080/actuator/health/readiness

# Full health with details (prod: requires authorization)
curl http://localhost:8080/actuator/health
```

### Metrics Endpoint

Prometheus metrics are available at:

```bash
curl http://localhost:8080/actuator/metrics
```

## Database Management

### Inspect Database

```bash
# Enter PostgreSQL shell
docker exec -it global-booking-postgres psql -U globalbooking -d auth_service

# Inside psql:
\dt                          # List all tables
\d users                     # Describe users table
SELECT * FROM users;         # Query users
\q                           # Quit
```

### Quick One-Liners

```bash
# List all tables
docker exec -it global-booking-postgres \
  psql -U globalbooking -d auth_service -c "\dt"

# Query all users
docker exec -it global-booking-postgres \
  psql -U globalbooking -d auth_service -c "SELECT * FROM users;"

# Count records
docker exec -it global-booking-postgres \
  psql -U globalbooking -d auth_service -c "SELECT COUNT(*) FROM users;"
```

### Database Reset (Development Only)

```bash
# Stop containers and remove volumes
docker compose -f docker-compose-dev.yml down -v

# Restart - database will be recreated
docker compose -f docker-compose-dev.yml up -d
```

## Build & Package

### Build Without Tests

```bash
./mvnw clean package -DskipTests
```

### Build With Tests

```bash
./mvnw clean package
```

### Build Docker Image Manually

```bash
# From service root directory
docker build -t global-booking/auth-service:latest .

# Run container
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=auth_service \
  -e DB_USERNAME=globalbooking \
  -e DB_PASSWORD=secret \
  -e JWT_SECRET=dev-secret-256bits-min-length-for-HS256-algorithm-do-not-use-in-prod \
  global-booking/auth-service:latest
```

## Configuration Details

### JWT Configuration

| Setting                    | Default (Dev)    | Default (Prod)   | Notes                            |
|----------------------------|------------------|------------------|----------------------------------|
| `JWT_SECRET`               | dev-secret-...   | `${JWT_SECRET}`  | Must be 32+ bytes base64 in prod |
| `ACCESS_TOKEN_EXPIRATION`  | 900000ms (15min) | 900000ms (15min) | Configurable via env var         |
| `REFRESH_TOKEN_EXPIRATION` | 604800000ms (7d) | 604800000ms (7d) | Configurable via env var         |

**Generate secure JWT secret:**

```bash
openssl rand -base64 32
# Output: aBcD1234+/xYzAbCd1234567890==

# Use this value for JWT_SECRET in production
export JWT_SECRET=aBcD1234+/xYzAbCd1234567890==
```

### Database Connection Pool

| Setting                    | Value | Purpose                           |
|----------------------------|-------|-----------------------------------|
| `maximum-pool-size`        | 20    | Max connections to database       |
| `minimum-idle`             | 5     | Min idle connections to maintain  |
| `connection-timeout`       | 30s   | Max wait for connection           |
| `idle-timeout`             | 10min | Close idle connections after      |
| `max-lifetime`             | 30min | Max connection lifetime           |
| `leak-detection-threshold` | 60s   | Alert if connection held too long |

### CORS Configuration

**Development:**

```yaml
allowed-origins:
  - http://localhost:3000      # Frontend dev server
  - http://localhost:5173      # Vite dev server
  - http://localhost:8080      # Same origin
```

**Production:**

```bash
# Set via environment variable (comma-separated)
export CORS_ALLOWED_ORIGINS=https://booking.example.com,https://www.example.com
```

### Logging

**Development:**

```yaml
level:
  root: INFO
  com.globalbooking: DEBUG
  org.springframework.web: DEBUG
  org.hibernate.SQL: DEBUG
```

**Production:**

```yaml
level:
  root: WARN
  com.globalbooking: INFO

file:
  name: /var/log/auth-service/app.log
  max-size: 10MB
  max-history: 30 days
  total-size-cap: 1GB
```

## Production Checklist

Before deploying to production:

- [ ] Generate secure JWT secret: `openssl rand -base64 32`
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Update `DB_USERNAME` and `DB_PASSWORD` with secure credentials
- [ ] Update `DB_HOST` to production database address
- [ ] Set `CORS_ALLOWED_ORIGINS` to your domain (s)
- [ ] Verify health endpoints respond
- [ ] Verify logs are being written to `/var/log/auth-service/`
- [ ] Confirm `show-sql: false` in production config
- [ ] Confirm `ddl-auto: validate` in production config
- [ ] Test database connection pool limits
- [ ] Verify `.env` is NOT committed to Git
- [ ] Add `.env` to `.gitignore`

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose -f docker-compose-dev.yml logs auth-service

# Common issues:
# 1. Database not ready - wait for postgres healthcheck
# 2. JWT_SECRET not set - check environment variables
# 3. Port 8080 already in use - check with: lsof -i :8080
```

### Database Connection Error

```bash
# Verify database is running
docker compose -f docker-compose-dev.yml ps postgres

# Check database logs
docker compose -f docker-compose-dev.yml logs postgres

# Verify credentials
docker exec -it global-booking-postgres \
  psql -U globalbooking -d auth_service -c "SELECT 1;"
```

### JWT Secret Too Short

```bash
# Error: JWT_SECRET must be at least 256 bits (32 bytes)
# Fix: Generate new secret
export JWT_SECRET=$(openssl rand -base64 32)
echo "Generated JWT_SECRET: $JWT_SECRET"
```

### Health Check Failing

```bash
# Check if service is actually running
curl -v http://localhost:8080/actuator/health/liveness

# Check logs for errors
docker compose -f docker-compose-dev.yml logs -f auth-service | grep -i error

# Verify spring profile is set correctly
docker compose -f docker-compose-dev.yml exec auth-service \
  curl http://localhost:8080/actuator/env | grep spring.profiles.active
```

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Rotate JWT secrets regularly** - Update in production environment
3. **Use HTTPS in production** - Configure via reverse proxy/load balancer
4. **Monitor health endpoints** - Set up alerts for liveness/readiness failures
5. **Review logs regularly** - Check for failed authentication attempts
6. **Update dependencies** - Run `./mvnw versions:display-dependency-updates`
7. **Limit CORS origins** - Only allow necessary domains

## Environment Variables Reference

### Required

| Variable                 | Purpose                 | Example                |
|--------------------------|-------------------------|------------------------|
| `SPRING_PROFILES_ACTIVE` | Which profile to load   | `dev` or `prod`        |
| `JWT_SECRET`             | Secret for signing JWTs | `aBcD1234+/xYzAbCd...` |

### Database

| Variable           | Default         | Example                             |
|--------------------|-----------------|-------------------------------------|
| `DB_HOST`          | `localhost`     | `postgres` or `db.prod.example.com` |
| `DB_PORT`          | `5432`          | `5432`                              |
| `DB_NAME`          | `auth_service`  | `auth_service`                      |
| `DB_USERNAME`      | `globalbooking` | `app_user`                          |
| `DB_PASSWORD`      | `secret`        | `secure-password-here`              |
| `DB_POOL_SIZE`     | `20`            | `20`                                |
| `DB_POOL_MIN_IDLE` | `5`             | `5`                                 |

### JWT

| Variable                   | Default     | Example                |
|----------------------------|-------------|------------------------|
| `ACCESS_TOKEN_EXPIRATION`  | `900000`    | `900000` (15min in ms) |
| `REFRESH_TOKEN_EXPIRATION` | `604800000` | `604800000` (7d in ms) |

### CORS

| Variable               | Default | Example                                               |
|------------------------|---------|-------------------------------------------------------|
| `CORS_ALLOWED_ORIGINS` | Empty   | `https://booking.example.com,https://www.example.com` |

## License

This project is licensed under the MIT License. See [LICENSE](../../LICENSE) for more information.

---

## Quick Start Commands

```bash
# Development setup
cd infrastructure
docker compose -f docker-compose-dev.yml up -d --build

# Check everything is running
docker compose -f docker-compose-dev.yml ps

# View service logs
docker compose -f docker-compose-dev.yml logs -f auth-service

# Health check
curl http://localhost:8080/actuator/health/liveness

# Database inspection
docker exec -it global-booking-postgres \
  psql -U globalbooking -d auth_service -c "\dt"

# Stop everything
docker compose -f docker-compose-dev.yml down
```

For more information about the Global Booking platform, see the main [README.md](../../README.md).