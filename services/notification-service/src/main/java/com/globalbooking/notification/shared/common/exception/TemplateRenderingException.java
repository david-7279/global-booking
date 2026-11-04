package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

/**
 * Raised when a template cannot be rendered, for example because a placeholder has no value.
 */
public class TemplateRenderingException extends NotificationException {

    public TemplateRenderingException(String message) {
        super(ErrorCode.TEMPLATE_RENDERING_FAILED, HttpStatus.UNPROCESSABLE_ENTITY, message);
    }
}
