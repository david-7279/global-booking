package com.globalbooking.notification.controller;

import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationStatus;
import com.globalbooking.notification.dto.request.NotificationFilter;
import com.globalbooking.notification.dto.response.NotificationAttemptResponse;
import com.globalbooking.notification.dto.response.NotificationResponse;
import com.globalbooking.notification.dto.response.UnreadCountResponse;
import com.globalbooking.notification.infrastructure.security.Actor;
import com.globalbooking.notification.service.NotificationQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Notification inbox of the authenticated user. Administrators may read any notification and retry deliveries.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Set<String> SORTABLE_FIELDS = Set.of("createdAt", "updatedAt", "sentAt", "status");

    private final NotificationQueryService service;

    @GetMapping
    public Page<NotificationResponse> list(
            Authentication authentication,
            @RequestParam(required = false) NotificationStatus status,
            @RequestParam(required = false) NotificationChannel channel,
            @RequestParam(required = false) Boolean unreadOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        NotificationFilter filter = new NotificationFilter(status, channel, unreadOnly);
        return service.list(Actor.from(authentication), filter, pageRequest(page, size, sort));
    }

    @GetMapping("/unread-count")
    public UnreadCountResponse unreadCount(Authentication authentication) {
        return new UnreadCountResponse(service.unreadCount(Actor.from(authentication)));
    }

    @GetMapping("/{id}")
    public NotificationResponse get(Authentication authentication, @PathVariable UUID id) {
        return service.get(Actor.from(authentication), id);
    }

    @GetMapping("/{id}/attempts")
    public List<NotificationAttemptResponse> attempts(Authentication authentication, @PathVariable UUID id) {
        return service.attempts(Actor.from(authentication), id);
    }

    @PostMapping("/{id}/read")
    public NotificationResponse markRead(Authentication authentication, @PathVariable UUID id) {
        return service.markRead(Actor.from(authentication), id);
    }

    @PostMapping("/{id}/retry")
    public NotificationResponse retry(Authentication authentication, @PathVariable UUID id) {
        return service.retry(Actor.from(authentication), id);
    }

    private Pageable pageRequest(int page, int size, String sort) {
        String[] parts = sort.split(",", 2);
        String property = SORTABLE_FIELDS.contains(parts[0]) ? parts[0] : "createdAt";
        Sort.Direction direction = parts.length == 2 && "asc".equalsIgnoreCase(parts[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(
                Math.min(Math.max(page, 0), 1000),
                Math.min(Math.max(size, 1), 100),
                Sort.by(direction, property)
        );
    }
}
