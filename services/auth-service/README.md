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

## Endpoints

#### Pubic Endpoints

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

#### Authenticated Endpoints

```text
GET /api/auth/me
```

#### Health Check Endpoints

```text
GET /actuator/health
GET /actuator/health/liveness
GET /actuator/health/readiness
```