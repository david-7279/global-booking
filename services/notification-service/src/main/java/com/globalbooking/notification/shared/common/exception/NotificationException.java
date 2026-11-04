package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

import java.util.Objects;

/**
 * Base type for failures that can be translated into an API error response.
 */
public class NotificationException extends RuntimeException {

    private final ErrorCode errorCode;
    private final HttpStatus status;

    public NotificationException(
            ErrorCode errorCode,
            HttpStatus status,
            String message
    ) {
        super(message);
        this.errorCode = Objects.requireNonNull(errorCode, "errorCode must not be null");
        this.status = Objects.requireNonNull(status, "status must not be null");
    }

    public NotificationException(
            ErrorCode errorCode,
            HttpStatus status,
            String message,
            Throwable cause
    ) {
        super(message, cause);
        this.errorCode = Objects.requireNonNull(errorCode, "errorCode must not be null");
        this.status = Objects.requireNonNull(status, "status must not be null");
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
