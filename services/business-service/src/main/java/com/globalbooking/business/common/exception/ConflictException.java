package com.globalbooking.business.common.exception;

import com.globalbooking.business.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ConflictException extends BusinessException {

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