package com.globalbooking.business.common.exception;

import com.globalbooking.business.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends BusinessException {

    public UnauthorizedException(
            ErrorCode errorCode,
            String message
    ) {
        super(
                ErrorCode.AUTHENTICATION_FAILED,
                HttpStatus.UNAUTHORIZED,
                message
        );
    }
}