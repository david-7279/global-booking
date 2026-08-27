package com.globalbooking.auth.common.exception;

import com.globalbooking.auth.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends AuthException {

    public UnauthorizedException(String message) {
        super(
                ErrorCode.AUTHENTICATION_FAILED,
                HttpStatus.UNAUTHORIZED,
                message
        );
    }
}