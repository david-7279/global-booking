package com.globalbooking.auth.infrastructure.outbox;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, UUID> {

    /**
     * Reads a small, oldest-first batch. A small batch keeps the publisher
     * simple and prevents one run from loading the whole table.
     */
    List<OutboxEvent> findTop50ByPublishedAtIsNullOrderByOccurredAtAsc();
}
