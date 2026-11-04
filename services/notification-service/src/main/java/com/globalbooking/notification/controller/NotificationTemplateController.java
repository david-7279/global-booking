package com.globalbooking.notification.controller;

import com.globalbooking.notification.domain.NotificationTemplate;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import com.globalbooking.notification.dto.request.NotificationTemplateRequest;
import com.globalbooking.notification.dto.response.NotificationTemplateResponse;
import com.globalbooking.notification.mapper.NotificationMapper;
import com.globalbooking.notification.service.TemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Catalogue of versioned templates. Reading is available to supervisors and administrators; registering a new version
 * is restricted to administrators.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notification-templates")
public class NotificationTemplateController {

    private final TemplateService templateService;
    private final NotificationMapper mapper;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public List<NotificationTemplateResponse> list(
            @RequestParam(required = false) NotificationTemplateCode code
    ) {
        List<NotificationTemplate> templates = code == null
                ? templateService.list()
                : templateService.list(code);

        return templates.stream().map(mapper::toResponse).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public NotificationTemplateResponse register(@Valid @RequestBody NotificationTemplateRequest request) {
        NotificationTemplate template = templateService.register(
                request.code(),
                request.channel(),
                request.locale(),
                request.subjectTemplate(),
                request.bodyTemplate(),
                request.description()
        );
        return mapper.toResponse(template);
    }
}
