package com.globalbooking.booking.shared.common;

import com.globalbooking.booking.domain.BookingStatus;

public final class BookingExceptions {
    private BookingExceptions() {
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String message) {
            super(message);
        }
    }

    public static class ConflictException extends RuntimeException {
        public ConflictException(String message) {
            super(message);
        }
    }

    public static class ForbiddenException extends RuntimeException {
        public ForbiddenException(String message) {
            super(message);
        }
    }

    public static class CatalogUnavailableException extends RuntimeException {
        public CatalogUnavailableException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class CatalogValidationException extends RuntimeException {
        public CatalogValidationException(String message) {
            super(message);
        }
    }

    public static class InvalidTransitionException extends RuntimeException {
        public InvalidTransitionException(BookingStatus from, BookingStatus to) {
            super("Transition from " + from + " to " + to + " is not allowed.");
        }
    }
}
