package com.globalbooking.booking.shared.common;

import com.globalbooking.booking.shared.common.BookingExceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.Instant;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<ApiError> notFound(NotFoundException e, HttpServletRequest r) {
        return error(HttpStatus.NOT_FOUND, "NOT_FOUND", e.getMessage(), r);
    }

    @ExceptionHandler({ConflictException.class, InvalidTransitionException.class})
    ResponseEntity<ApiError> conflict(RuntimeException e, HttpServletRequest r) {
        return error(HttpStatus.CONFLICT, "CONFLICT", e.getMessage(), r);
    }

    @ExceptionHandler({ForbiddenException.class})
    ResponseEntity<ApiError> forbidden(RuntimeException e, HttpServletRequest r) {
        return error(HttpStatus.FORBIDDEN, "ACCESS_DENIED", e.getMessage(), r);
    }

    @ExceptionHandler({CatalogValidationException.class, IllegalArgumentException.class, MethodArgumentNotValidException.class})
    ResponseEntity<ApiError> bad(Exception e, HttpServletRequest r) {
        return error(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", e.getMessage(), r);
    }

    @ExceptionHandler(CatalogUnavailableException.class)
    ResponseEntity<ApiError> unavailable(Exception e, HttpServletRequest r) {
        return error(HttpStatus.SERVICE_UNAVAILABLE, "CATALOG_UNAVAILABLE", e.getMessage(), r);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> internal(Exception e, HttpServletRequest r) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "An unexpected error occurred.", r);
    }

    private ResponseEntity<ApiError> error(HttpStatus status, String code, String message, HttpServletRequest request) {
        return ResponseEntity.status(status).body(new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), code, message, request.getRequestURI()));
    }

    public record ApiError(Instant timestamp, int status, String error, String code, String message, String path) {
    }
}
