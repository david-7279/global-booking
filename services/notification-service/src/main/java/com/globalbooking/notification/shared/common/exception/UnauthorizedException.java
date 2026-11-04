package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends NotificationException {

    public UnauthorizedException(String message) {
        this(ErrorCode.AUTHENTICATION_FAILED, message);
    }

    public UnauthorizedException(
            ErrorCode errorCode,
            String message
    ) {
        super(errorCode, HttpStatus.UNAUTHORIZED, message);
    }
}
