package com.globalbooking.business.common.exception;

import com.globalbooking.business.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ForbiddenException extends BusinessException {

    public ForbiddenException(String message) {
        super(
                ErrorCode.ACCESS_DENIED,
                HttpStatus.FORBIDDEN,
                message
        );
    }
}