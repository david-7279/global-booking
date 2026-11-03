package com.globalbooking.booking.shared.common;

import com.globalbooking.booking.domain.BookingStatus;

public class InvalidTransitionException extends BookingExceptions.InvalidTransitionException {
    public InvalidTransitionException(BookingStatus from, BookingStatus to) {
        super(from, to);
    }
}
