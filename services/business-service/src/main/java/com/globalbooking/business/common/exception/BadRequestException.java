package com.globalbooking.business.common.exception;

import com.globalbooking.business.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class BadRequestException extends BusinessException {

    public BadRequestException(String message) {
        super(
                ErrorCode.INVALID_REQUEST,
                HttpStatus.BAD_REQUEST,
                message
        );
    }
}