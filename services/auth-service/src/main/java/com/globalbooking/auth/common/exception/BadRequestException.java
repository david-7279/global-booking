package com.globalbooking.auth.common.exception;

import com.globalbooking.auth.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class BadRequestException extends AuthException {

    public BadRequestException(String message) {
        super(
                ErrorCode.INVALID_REQUEST,
                HttpStatus.BAD_REQUEST,
                message
        );
    }
}