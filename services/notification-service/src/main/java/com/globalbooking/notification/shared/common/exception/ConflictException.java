package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ConflictException extends NotificationException {

    public ConflictException(
            ErrorCode errorCode,
            String message
    ) {
        super(errorCode, HttpStatus.CONFLICT, message);
    }
}
