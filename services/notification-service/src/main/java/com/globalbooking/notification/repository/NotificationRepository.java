package com.globalbooking.notification.repository;

import com.globalbooking.notification.domain.Notification;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository
        extends JpaRepository<Notification, UUID>, JpaSpecificationExecutor<Notification> {

    long countByRecipientUserIdAndChannelAndReadAtIsNull(UUID recipientUserId, NotificationChannel channel);

    /**
     * Identifiers of the notifications that are due for a delivery attempt, oldest attempt first.
     * <p>
     * A notification without a scheduled date is treated as due immediately, so a row inserted by an operator or a
     * migration can never get stuck in {@code PENDING}.
     */
    @Query("""
            select n.id
            from Notification n
            where n.channel = :channel
              and n.status in :statuses
              and (n.nextAttemptAt is null or n.nextAttemptAt <= :now)
            order by n.nextAttemptAt asc
            """)
    List<UUID> findDueIds(
            @Param("channel") NotificationChannel channel,
            @Param("statuses") Collection<NotificationStatus> statuses,
            @Param("now") Instant now,
            Pageable pageable
    );

    /**
     * Notifications that stayed in an intermediate status, for example because the process stopped during delivery.
     */
    @Query("""
            select n
            from Notification n
            where n.status = :status
              and n.updatedAt <= :cutoff
            order by n.updatedAt asc
            """)
    List<Notification> findStale(
            @Param("status") NotificationStatus status,
            @Param("cutoff") Instant cutoff,
            Pageable pageable
    );
}
