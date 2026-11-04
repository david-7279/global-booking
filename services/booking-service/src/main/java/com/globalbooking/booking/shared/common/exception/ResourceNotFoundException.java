package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BookingException {

    public ResourceNotFoundException(String message) {
        this(ErrorCode.RESOURCE_NOT_FOUND, message);
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
