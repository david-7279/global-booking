# Stage 1: Build
FROM maven:3.9.9-amazoncorretto-21 AS builder

WORKDIR /app

# Copy Maven configuration first for better layer caching
COPY pom.xml .

# Download dependencies
RUN mvn -B -q -DskipTests dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN mvn -q clean package -DskipTests


# Stage 2: Runtime
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Install security updates and required tools
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    \
    # Create non-root user
    groupadd --system spring && \
    useradd --system \
        --gid spring \
        --create-home \
        --home-dir /home/spring \
        spring && \
    \
    # Create log directory
    mkdir -p /var/log/auth-service && \
    chown -R spring:spring /var/log/auth-service

# Copy application JAR from builder
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Application port
EXPOSE 8080

# Run as non-root user
USER spring

# Container health check
HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=40s \
    --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health/liveness || exit 1

# JVM configuration
# Spring Boot automatically reads it from the container environment.
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+ExitOnOutOfMemoryError", \
    "-XX:+UseG1GC", \
    "-XX:MaxGCPauseMillis=200", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]