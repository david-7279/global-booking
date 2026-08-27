package com.globalbooking.auth.common.exception;

import com.globalbooking.auth.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends AuthException {

    public ResourceNotFoundException(
            ErrorCode errorCode,
            String message
    ) {
        super(
                errorCode,
                HttpStatus.NOT_FOUND,
                message
        );
    }
}