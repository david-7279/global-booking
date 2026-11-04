package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class BadRequestException extends BookingException {

    public BadRequestException(String message) {
        super(
                ErrorCode.INVALID_REQUEST,
                HttpStatus.BAD_REQUEST,
                message
        );
    }
}