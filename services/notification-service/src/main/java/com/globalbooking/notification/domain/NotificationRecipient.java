package com.globalbooking.notification.domain;

import com.globalbooking.notification.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * Local projection of the auth-service user, kept up to date from auth user events.
 * <p>
 * The notification service never reads the auth database. Booking events only carry the user identifier, so this
 * projection is what allows an email to be resolved for them.
 */
@Getter
@Entity
@Table(name = "notification_recipients")
public class NotificationRecipient extends BaseEntity {

    public static final String STATUS_DELETED = "DELETED";

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(length = 120)
    private String username;

    /**
     * Mirrors the auth-service status contract: {@code ACTIVE}, {@code SUSPENDED}, {@code BANNED} or {@code DELETED}.
     */
    @Column(name = "account_status", nullable = false, length = 50)
    private String accountStatus;

    @Column(nullable = false, length = 10)
    private String locale;

    @Column(name = "last_event_at", nullable = false)
    private Instant lastEventAt;

    protected NotificationRecipient() {
        // Required by JPA.
    }

    public NotificationRecipient(
            UUID userId,
            String email,
            String username,
            String accountStatus,
            String locale,
            Instant eventAt
    ) {
        if (userId == null) {
            throw new IllegalArgumentException("Recipient user id is required");
        }
        this.userId = userId;
        this.email = requireEmail(email);
        this.username = username;
        this.accountStatus = requireStatus(accountStatus);
        this.locale = locale;
        this.lastEventAt = eventAt;
    }

    public void update(
            String email,
            String username,
            String accountStatus,
            Instant eventAt
    ) {
        this.email = requireEmail(email);
        this.username = username;
        this.accountStatus = requireStatus(accountStatus);
        this.lastEventAt = eventAt;
    }

    public void changeStatus(String accountStatus, Instant eventAt) {
        this.accountStatus = requireStatus(accountStatus);
        this.lastEventAt = eventAt;
    }

    public void delete(Instant eventAt) {
        this.accountStatus = STATUS_DELETED;
        this.lastEventAt = eventAt;
        markDeleted();
    }

    /**
     * Older events must not overwrite a newer projection state.
     */
    public boolean acceptsEvent(Instant eventAt) {
        return eventAt != null && eventAt.isAfter(lastEventAt);
    }

    public boolean isDeleted() {
        return STATUS_DELETED.equals(accountStatus);
    }

    public boolean canReceiveEmail() {
        return !isDeleted() && email != null && !email.isBlank();
    }

    public String displayName() {
        return username == null || username.isBlank() ? email : username;
    }

    private static String requireEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Recipient email is required");
        }
        return email.trim();
    }

    private static String requireStatus(String accountStatus) {
        if (accountStatus == null || accountStatus.isBlank()) {
            throw new IllegalArgumentException("Recipient account status is required");
        }
        return accountStatus;
    }
}
