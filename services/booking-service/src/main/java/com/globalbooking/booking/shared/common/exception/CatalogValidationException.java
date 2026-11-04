package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class CatalogValidationException extends BookingException {

    public CatalogValidationException(String message) {
        super(
                ErrorCode.VALIDATION_ERROR,
                HttpStatus.BAD_REQUEST,
                message
        );
    }
}
