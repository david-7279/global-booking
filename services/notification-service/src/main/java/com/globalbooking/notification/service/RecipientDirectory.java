package com.globalbooking.notification.service;

import com.globalbooking.notification.shared.common.exception.RecipientNotReadyException;
import com.globalbooking.notification.infrastructure.config.NotificationProperties;
import com.globalbooking.notification.domain.NotificationRecipient;
import com.globalbooking.notification.repository.NotificationRecipientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * Keeps the local recipient projection in sync with auth events and resolves recipients for booking events.
 */
@Service
@RequiredArgsConstructor
public class RecipientDirectory {

    private final NotificationRecipientRepository repository;
    private final NotificationProperties properties;

    /**
     * Creates or refreshes the recipient. Events older than the stored state are ignored so redeliveries cannot move the
     * projection backwards.
     */
    @Transactional
    public NotificationRecipient upsert(
            UUID userId,
            String email,
            String username,
            String accountStatus,
            Instant eventAt
    ) {
        Optional<NotificationRecipient> existing = repository.findByUserId(userId);
        if (existing.isPresent()) {
            NotificationRecipient recipient = existing.get();
            if (recipient.acceptsEvent(eventAt)) {
                recipient.update(email, username, accountStatus, eventAt);
            }
            return recipient;
        }

        NotificationRecipient recipient = new NotificationRecipient(
                userId,
                email,
                username,
                accountStatus,
                properties.defaultLocale(),
                eventAt == null ? Instant.now() : eventAt
        );
        return repository.save(recipient);
    }

    @Transactional
    public Optional<NotificationRecipient> changeStatus(UUID userId, String accountStatus, Instant eventAt) {
        return repository.findByUserId(userId).map(recipient -> {
            if (recipient.acceptsEvent(eventAt)) {
                recipient.changeStatus(accountStatus, eventAt);
            }
            return recipient;
        });
    }

    @Transactional
    public Optional<NotificationRecipient> delete(UUID userId, Instant eventAt) {
        return repository.findByUserId(userId).map(recipient -> {
            if (!recipient.isDeleted() && (eventAt == null || recipient.acceptsEvent(eventAt))) {
                recipient.delete(eventAt == null ? Instant.now() : eventAt);
            }
            return recipient;
        });
    }

    /**
     * Returns the recipient or fails with a transient error when the projection has not seen the user yet.
     */
    @Transactional(readOnly = true)
    public NotificationRecipient require(UUID userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new RecipientNotReadyException(
                        "Recipient projection does not contain user " + userId
                ));
    }

    @Transactional(readOnly = true)
    public Optional<NotificationRecipient> find(UUID userId) {
        return repository.findByUserId(userId);
    }
}
