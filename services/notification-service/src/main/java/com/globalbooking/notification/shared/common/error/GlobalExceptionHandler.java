package com.globalbooking.notification.shared.common.error;

import com.globalbooking.notification.shared.common.exception.NotificationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles application-specific exceptions.
     */
    @ExceptionHandler(NotificationException.class)
    public ResponseEntity<ApiError> handleNotificationException(
            NotificationException ex,
            HttpServletRequest request
    ) {
        log.atWarn()
                .setMessage("Application error")
                .addKeyValue("event", ex.getErrorCode().name())
                .addKeyValue("path", request.getRequestURI())
                .log();

        ApiError error = buildError(
                ex.getErrorCode(),
                ex.getStatus(),
                ex.getMessage(),
                request,
                List.of()
        );

        return ResponseEntity
                .status(ex.getStatus())
                .body(error);
    }

    /**
     * Handles bean validation errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        List<ApiError.FieldError> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::mapFieldError)
                .toList();

        log.atDebug()
                .setMessage("Validation error")
                .addKeyValue("event", "validation_error")
                .addKeyValue("path", request.getRequestURI())
                .addKeyValue("field_errors", details.size())
                .log();

        ApiError error = buildError(
                ErrorCode.VALIDATION_ERROR,
                HttpStatus.BAD_REQUEST,
                "One or more fields are invalid.",
                request,
                details
        );

        return ResponseEntity
                .badRequest()
                .body(error);
    }

    /**
     * Handles malformed or unreadable JSON request bodies.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpServletRequest request
    ) {
        log.atDebug()
                .setMessage("Malformed request body")
                .addKeyValue("event", "invalid_request")
                .addKeyValue("path", request.getRequestURI())
                .log();

        return ResponseEntity
                .badRequest()
                .body(buildError(
                        ErrorCode.INVALID_REQUEST,
                        HttpStatus.BAD_REQUEST,
                        "The request body is invalid.",
                        request,
                        List.of()
                ));
    }

    /**
     * Handles request parameters that cannot be converted to the expected type.
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request
    ) {
        log.atDebug()
                .setMessage("Request parameter type mismatch")
                .addKeyValue("event", "invalid_request")
                .addKeyValue("parameter", ex.getName())
                .addKeyValue("path", request.getRequestURI())
                .log();

        return ResponseEntity
                .badRequest()
                .body(buildError(
                        ErrorCode.INVALID_REQUEST,
                        HttpStatus.BAD_REQUEST,
                        "The request contains an invalid value for '%s'.".formatted(ex.getName()),
                        request,
                        List.of()
                ));
    }

    /**
     * Handles Spring Security authentication failures.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(
            AuthenticationException ex,
            HttpServletRequest request
    ) {
        log.atWarn()
                .setMessage("Authentication failed")
                .addKeyValue("event", "authentication_failed")
                .addKeyValue("path", request.getRequestURI())
                .addKeyValue("failure_type", ex.getClass().getSimpleName())
                .log();

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(buildError(
                        ErrorCode.AUTHENTICATION_FAILED,
                        HttpStatus.UNAUTHORIZED,
                        "Authentication failed.",
                        request,
                        List.of()
                ));
    }

    /**
     * Handles authentication service failures.
     */
    @ExceptionHandler(AuthenticationServiceException.class)
    public ResponseEntity<ApiError> handleAuthenticationServiceException(
            AuthenticationServiceException ex,
            HttpServletRequest request
    ) {
        log.atError()
                .setMessage("Authentication service error")
                .addKeyValue("event", "authentication_failed")
                .addKeyValue("path", request.getRequestURI())
                .setCause(ex)
                .log();

        return buildInternalServerError(request);
    }

    /**
     * Handles authorization failures.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDeniedException(
            AccessDeniedException ex,
            HttpServletRequest request
    ) {
        log.atWarn()
                .setMessage("Access denied")
                .addKeyValue("event", "access_denied")
                .addKeyValue("path", request.getRequestURI())
                .log();

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(buildError(
                        ErrorCode.ACCESS_DENIED,
                        HttpStatus.FORBIDDEN,
                        "You do not have permission to access this resource.",
                        request,
                        List.of()
                ));
    }

    /**
     * Handles unsupported HTTP methods.
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex,
            HttpServletRequest request
    ) {
        log.atDebug()
                .setMessage("HTTP method not supported")
                .addKeyValue("event", "invalid_request")
                .addKeyValue("method", request.getMethod())
                .addKeyValue("path", request.getRequestURI())
                .log();

        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(buildError(
                        ErrorCode.INVALID_REQUEST,
                        HttpStatus.METHOD_NOT_ALLOWED,
                        "The HTTP method is not supported for this resource.",
                        request,
                        List.of()
                ));
    }

    /**
     * Handles requests to endpoints that do not exist, so they are not reported as internal errors.
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> handleNoResourceFound(
            NoResourceFoundException ex,
            HttpServletRequest request
    ) {
        log.atDebug()
                .setMessage("Endpoint not found")
                .addKeyValue("event", "endpoint_not_found")
                .addKeyValue("path", request.getRequestURI())
                .log();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(buildError(
                        ErrorCode.ENDPOINT_NOT_FOUND,
                        HttpStatus.NOT_FOUND,
                        "The requested endpoint does not exist.",
                        request,
                        List.of()
                ));
    }

    /**
     * Handles unexpected application errors.
     * <p>
     * Never exposes the original exception message to the client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpectedException(
            Exception ex,
            HttpServletRequest request
    ) {
        String traceId = UUID.randomUUID().toString();

        log.atError()
                .setMessage("Unexpected error")
                .addKeyValue("event", "internal_error")
                .addKeyValue("trace_id", traceId)
                .addKeyValue("method", request.getMethod())
                .addKeyValue("path", request.getRequestURI())
                .setCause(ex)
                .log();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(
                        Instant.now(),
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                        ErrorCode.INTERNAL_ERROR.name(),
                        "An unexpected error occurred.",
                        request.getRequestURI(),
                        traceId,
                        List.of()
                ));
    }

    private ResponseEntity<ApiError> buildInternalServerError(
            HttpServletRequest request
    ) {
        String traceId = UUID.randomUUID().toString();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(
                        Instant.now(),
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                        ErrorCode.INTERNAL_ERROR.name(),
                        "An unexpected error occurred.",
                        request.getRequestURI(),
                        traceId,
                        List.of()
                ));
    }

    private ApiError buildError(
            ErrorCode code,
            HttpStatus status,
            String message,
            HttpServletRequest request,
            List<ApiError.FieldError> details
    ) {
        return new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                code.name(),
                message,
                request.getRequestURI(),
                UUID.randomUUID().toString(),
                details
        );
    }

    private ApiError.FieldError mapFieldError(FieldError error) {
        return new ApiError.FieldError(
                error.getField(),
                error.getDefaultMessage()
        );
    }
}
