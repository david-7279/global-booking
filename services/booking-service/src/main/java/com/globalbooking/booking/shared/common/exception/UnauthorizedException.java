package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class UnauthorizedException extends BookingException {

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