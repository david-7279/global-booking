package com.globalbooking.notification.infrastructure.messaging;

import com.globalbooking.notification.domain.DeadLetteredEvent;
import com.globalbooking.notification.repository.DeadLetteredEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Persists dead-letter metadata in its own transaction so the audit survives even when the consumer transaction is
 * rolled back.
 */
@Service
@RequiredArgsConstructor
public class DeadLetterAuditService {

    private final DeadLetteredEventRepository repository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(
            UUID eventId,
            String consumerName,
            String eventType,
            String sourceQueue,
            String routingKey,
            String payload,
            String failureReason,
            int retryCount
    ) {
        repository.save(new DeadLetteredEvent(
                eventId,
                consumerName,
                eventType,
                sourceQueue,
                routingKey,
                payload,
                failureReason,
                retryCount
        ));
    }
}
