package com.globalbooking.business.common.exception;

import com.globalbooking.business.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BusinessException {

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