package com.globalbooking.auth.common.error;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String code,
        String message,
        String path,
        String traceId,
        List<FieldError> details
) {

    public ApiError {
        details = details == null ? List.of() : List.copyOf(details);
    }

    public record FieldError(
            String field,
            String message
    ) {
    }
}