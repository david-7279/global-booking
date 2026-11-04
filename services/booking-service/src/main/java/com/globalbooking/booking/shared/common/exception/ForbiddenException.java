package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ForbiddenException extends BookingException {

    public ForbiddenException(String message) {
        super(
                ErrorCode.ACCESS_DENIED,
                HttpStatus.FORBIDDEN,
                message
        );
    }
}