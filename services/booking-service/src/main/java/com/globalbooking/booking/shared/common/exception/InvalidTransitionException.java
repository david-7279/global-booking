package com.globalbooking.booking.shared.common.exception;

import com.globalbooking.booking.domain.BookingStatus;
import com.globalbooking.booking.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

public class InvalidTransitionException extends BookingException {

    public InvalidTransitionException(String message) {
        super(
                ErrorCode.INVALID_REQUEST,
                HttpStatus.CONFLICT,
                message
        );
    }

    public InvalidTransitionException(BookingStatus current, BookingStatus target) {
        this("Cannot transition booking from " + current + " to " + target + ".");
    }
}
