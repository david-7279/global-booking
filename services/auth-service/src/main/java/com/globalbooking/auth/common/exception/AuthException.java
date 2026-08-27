package com.globalbooking.auth.common.exception;

import com.globalbooking.auth.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

import java.util.Objects;

public class AuthException extends RuntimeException {

    private final ErrorCode errorCode;
    private final HttpStatus status;

    public AuthException(
            ErrorCode errorCode,
            HttpStatus status,
            String message
    ) {
        super(message);
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