package com.globalbooking.notification.service;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import com.globalbooking.notification.shared.common.exception.BadRequestException;
import com.globalbooking.notification.shared.common.exception.ConflictException;
import com.globalbooking.notification.shared.common.exception.ForbiddenException;
import com.globalbooking.notification.shared.common.exception.ResourceNotFoundException;
import com.globalbooking.notification.domain.Notification;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.dto.request.NotificationFilter;
import com.globalbooking.notification.dto.response.NotificationAttemptResponse;
import com.globalbooking.notification.dto.response.NotificationResponse;
import com.globalbooking.notification.mapper.NotificationMapper;
import com.globalbooking.notification.repository.DeliveryAttemptRepository;
import com.globalbooking.notification.repository.NotificationRepository;
import com.globalbooking.notification.repository.NotificationSpecifications;
import com.globalbooking.notification.infrastructure.security.Actor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Read and support operations over the notification history.
 */
@Service
@RequiredArgsConstructor
public class NotificationQueryService {

    private final NotificationRepository notificationRepository;
    private final DeliveryAttemptRepository attemptRepository;
    private final NotificationMapper mapper;

    @Transactional(readOnly = true)
    public Page<NotificationResponse> list(Actor actor, NotificationFilter filter, Pageable pageable) {
        Specification<Notification> specification = actor.isAdmin()
                ? (root, query, criteriaBuilder) -> criteriaBuilder.conjunction()
                : NotificationSpecifications.recipient(actor.userId());

        if (filter != null) {
            if (filter.status() != null) {
                specification = specification.and(NotificationSpecifications.status(filter.status()));
            }
            if (filter.channel() != null) {
                specification = specification.and(NotificationSpecifications.channel(filter.channel()));
            }
            if (Boolean.TRUE.equals(filter.unreadOnly())) {
                specification = specification.and(NotificationSpecifications.unread());
            }
        }

        return notificationRepository.findAll(specification, pageable).map(mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public NotificationResponse get(Actor actor, UUID id) {
        Notification notification = find(id);
        requireAccess(actor, notification);
        return mapper.toResponse(notification);
    }

    @Transactional(readOnly = true)
    public long unreadCount(Actor actor) {
        return notificationRepository.countByRecipientUserIdAndChannelAndReadAtIsNull(
                actor.userId(),
                NotificationChannel.IN_APP
        );
    }

    @Transactional
    public NotificationResponse markRead(Actor actor, UUID id) {
        Notification notification = find(id);
        requireAccess(actor, notification);

        if (notification.getChannel() != NotificationChannel.IN_APP) {
            throw new BadRequestException("Only in-app notifications can be marked as read.");
        }

        notification.markRead();
        return mapper.toResponse(notification);
    }

    /**
     * Requeues a failed notification. Restricted to administrators because it can send an unexpected message.
     */
    @Transactional
    public NotificationResponse retry(Actor actor, UUID id) {
        if (!actor.isAdmin()) {
            throw new ForbiddenException("Only administrators can retry a notification delivery.");
        }

        Notification notification = find(id);
        if (!notification.canRequestRetry()) {
            throw new ConflictException(
                    ErrorCode.NOTIFICATION_NOT_RETRYABLE,
                    "Notification in status " + notification.getStatus() + " cannot be retried."
            );
        }

        notification.retryNow();
        return mapper.toResponse(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationAttemptResponse> attempts(Actor actor, UUID id) {
        Notification notification = find(id);
        requireAccess(actor, notification);

        return attemptRepository.findByNotificationIdOrderByAttemptedAtDesc(id).stream()
                .map(attempt -> new NotificationAttemptResponse(
                        attempt.getId(),
                        attempt.getAttemptNumber(),
                        attempt.getOutcome(),
                        attempt.getErrorMessage(),
                        attempt.getAttemptedAt()
                ))
                .toList();
    }

    private Notification find(UUID id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));
    }

    private void requireAccess(Actor actor, Notification notification) {
        if (!actor.isAdmin() && !actor.userId().equals(notification.getRecipientUserId())) {
            throw new ForbiddenException("You cannot access this notification.");
        }
    }
}
