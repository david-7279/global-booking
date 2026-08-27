package com.globalbooking.auth.common.exception;

import com.globalbooking.auth.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ConflictException extends AuthException {

    public ConflictException(
            ErrorCode errorCode,
            String message
    ) {
        super(
                errorCode,
                HttpStatus.CONFLICT,
                message
        );
    }
}