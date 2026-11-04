package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

/**
 * The recipient projection does not know the user yet. This is expected when a booking event is consumed before the
 * corresponding auth event, so the event is retried with backoff instead of being discarded.
 */
public class RecipientNotReadyException extends NotificationException {

    public RecipientNotReadyException(String message) {
        super(ErrorCode.RECIPIENT_UNAVAILABLE, HttpStatus.CONFLICT, message);
    }
}
