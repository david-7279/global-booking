package com.globalbooking.business.common.exception;

import com.globalbooking.business.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        this(ErrorCode.INVALID_REQUEST, message);
    }

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
