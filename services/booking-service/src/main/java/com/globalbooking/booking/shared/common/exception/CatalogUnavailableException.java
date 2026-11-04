package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class CatalogUnavailableException extends BookingException {

    public CatalogUnavailableException(String message) {
        super(
                ErrorCode.CATALOG_UNAVAILABLE,
                HttpStatus.SERVICE_UNAVAILABLE,
                message
        );
    }
}
