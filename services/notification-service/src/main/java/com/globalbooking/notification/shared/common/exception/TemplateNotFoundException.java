package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class TemplateNotFoundException extends NotificationException {

    public TemplateNotFoundException(String message) {
        super(ErrorCode.TEMPLATE_NOT_FOUND, HttpStatus.NOT_FOUND, message);
    }
}
