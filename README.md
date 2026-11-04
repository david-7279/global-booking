# Global Booking

A multi-tenant SaaS platform for appointment management, designed for businesses such as hairdressers, massage
therapists, personal trainers, and other service professionals.

## Overview

Global Booking allows businesses to create their own booking page, configure services and availability, and manage
appointment requests from a central dashboard.

The project is primarily designed as a learning project focused on microservices architecture, asynchronous
communication, distributed systems, and scalable backend development.

## Key Features

- Business registration and authentication
- Custom booking pages for each business
- Service and availability management
- Appointment creation and management
- Accept/reject appointment requests
- Asynchronous notifications
- Event-driven communication with RabbitMQ
- Multi-tenant architecture

## Tech Stack

- Java 21
- Spring Boot
- Spring Security
- Spring Cloud Gateway
- PostgreSQL
- RabbitMQ
- Docker & Docker Compose
- React / Next.js
- GitHub Actions

## Prerequisites

- Java 21+
- Maven
- Node.js
- Docker & Docker Compose
- Git

## Global Structure

```text
global-booking/
├── services/
│   ├── auth-service/
│   ├── business-service/
│   ├── booking-service/
│   └── notification-service/
│
├── gateway/
│   └── api-gateway/
│
├── frontend/
│
├── infrastructure/
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── docker-compose-dev.yml
│   └── init-databases.sql
│   └── rabbitmq/
│
├── docs/
├── README.md
└── .gitignore
```

Each service is an independent Spring Boot application with its own domain, database, configuration, and deployment
lifecycle.

## Installation & Getting Started

Clone the repository:

```bash
git clone https://github.com/<username>/global-booking.git
cd global-booking
```

### Copy the environment variables file:

```bash
cp infrastructure/.env.example infrastructure/.env
```

### Build and start everything:

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml up -d --build
````

### Check status of the services:

#### Check the docker containers

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml ps
```

#### Check the logs of the auth-service

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml logs -f auth-service
```

#### Check the logs of the business-service

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml logs -f business-service
```

#### Check the logs of the booking-service

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml logs -f booking-service
```

#### Check the logs of the notification-service

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml logs -f notification-service
```

#### Check the status of RabbitMQ

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml  ps rabbitmq
```

#### Check the health of RabbitMQ

```bash
docker inspect --format='{{json .State.Health}}' global-booking-rabbitmq
```

#### RabbitMQ Management UI

```text
http://localhost:15672
```

#### Mailpit UI (emails captured in development)

```text
http://localhost:8025
```

### Local endpoints

| Service              | URL                    |
|----------------------|------------------------|
| auth-service         | http://localhost:8081  |
| business-service     | http://localhost:8082  |
| booking-service      | http://localhost:8083  |
| notification-service | http://localhost:8084  |
| RabbitMQ management  | http://localhost:15672 |
| Mailpit (dev email)  | http://localhost:8025  |

### Stop everything

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml down
```

### Stop and reset databases (REMOVE ALL DATA)

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml down -v
```

## Usage

The platform follows this general flow:

```text
Customer
   ↓
Booking Page
   ↓
API Gateway
   ↓
Appointment Service
   ↓
RabbitMQ
   ↓
Notification Service
   ↓
Business Owner
   ↓
Accept / Reject
   ↓
RabbitMQ
   ↓
Customer Notification
```

## Documentation

- [Event contracts](./docs/events/README.md)
- [Business service contract](./docs/business-service-contract.md)
- [Booking service implementation report](./docs/booking-service-implementation-report.md)
- [Notification service contract](./docs/notification-service-contract.md)
- [Notification service implementation report](./docs/notification-service-implementation-report.md)

## License

This project is licensed under the MIT License.

See [LICENSE](./LICENSE) for more information.