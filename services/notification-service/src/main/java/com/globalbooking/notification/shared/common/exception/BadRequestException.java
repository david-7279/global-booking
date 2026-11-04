package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class BadRequestException extends NotificationException {

    public BadRequestException(String message) {
        super(ErrorCode.INVALID_REQUEST, HttpStatus.BAD_REQUEST, message);
    }

    public BadRequestException(
            ErrorCode errorCode,
            String message
    ) {
        super(errorCode, HttpStatus.BAD_REQUEST, message);
    }
}
