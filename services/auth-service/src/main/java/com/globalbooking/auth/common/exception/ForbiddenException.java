package com.globalbooking.auth.common.exception;

import com.globalbooking.auth.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ForbiddenException extends AuthException {

    public ForbiddenException(String message) {
        super(
                ErrorCode.ACCESS_DENIED,
                HttpStatus.FORBIDDEN,
                message
        );
    }
}