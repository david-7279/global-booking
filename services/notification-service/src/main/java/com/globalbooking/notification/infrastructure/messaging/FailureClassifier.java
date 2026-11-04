package com.globalbooking.notification.infrastructure.messaging;

import com.globalbooking.notification.shared.common.exception.PermanentEventException;
import com.globalbooking.notification.shared.common.exception.TemplateNotFoundException;
import com.globalbooking.notification.shared.common.exception.TemplateRenderingException;
import org.springframework.stereotype.Component;

/**
 * Distinguishes failures that can succeed on a retry from failures that never will.
 * <p>
 * Anything not classified as permanent is retried, because infrastructure failures (database, broker, projection lag)
 * are the common cause of a failed consumption.
 */
@Component
public class FailureClassifier {

    public boolean isPermanent(Throwable failure) {
        return failure instanceof PermanentEventException
                || failure instanceof TemplateNotFoundException
                || failure instanceof TemplateRenderingException
                || failure instanceof IllegalArgumentException;
    }
}
