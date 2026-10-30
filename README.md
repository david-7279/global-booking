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
│   ├── appointment-service/
│   └── notification-service/
│
├── gateway/
│   └── api-gateway/
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

Copy the environment variables file:

```bash
cp infrastructure/.env.example infrastructure/.env
```

Build and start everything:

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml up -d --build
````

Check status of the services:

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml ps
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml logs -f auth-service
```

Stop everything

```bash
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose-dev.yml down
```

Stop and reset databases (REMOVE ALL DATA)

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

## License

This project is licensed under the MIT License.

See [LICENSE](./LICENSE) for more information.