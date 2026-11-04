package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends NotificationException {

    public ResourceNotFoundException(String message) {
        this(ErrorCode.NOTIFICATION_NOT_FOUND, message);
    }

    public ResourceNotFoundException(
            ErrorCode errorCode,
            String message
    ) {
        super(errorCode, HttpStatus.NOT_FOUND, message);
    }
}
