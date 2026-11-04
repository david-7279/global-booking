package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ConflictException extends BookingException {

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