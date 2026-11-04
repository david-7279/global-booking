package com.globalbooking.notification.shared.common.exception;

import com.globalbooking.notification.shared.common.error.ErrorCode;
import org.springframework.http.HttpStatus;

/**
 * An event that can never be processed, for example an invalid envelope or an unsupported event type. Retrying it would
 * only repeat the same failure, so it is routed to the dead-letter queue.
 */
public class PermanentEventException extends NotificationException {

    public PermanentEventException(String message) {
        super(ErrorCode.EVENT_INVALID, HttpStatus.UNPROCESSABLE_ENTITY, message);
    }

    public PermanentEventException(String message, Throwable cause) {
        super(ErrorCode.EVENT_INVALID, HttpStatus.UNPROCESSABLE_ENTITY, message, cause);
    }
}
