package com.globalbooking.auth.common.error;

import com.globalbooking.auth.common.exception.AuthException;
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

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles application-specific exceptions.
     */
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ApiError> handleAuthException(
            AuthException ex,
            HttpServletRequest request
    ) {
        log.warn(
                "Application error: code={}, path={}",
                ex.getErrorCode(),
                request.getRequestURI()
        );

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

        log.debug(
                "Validation error: path={}, fields={}",
                request.getRequestURI(),
                details.size()
        );

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
        log.debug(
                "Malformed request body: path={}",
                request.getRequestURI()
        );

        ApiError error = buildError(
                ErrorCode.INVALID_REQUEST,
                HttpStatus.BAD_REQUEST,
                "The request body is invalid.",
                request,
                List.of()
        );

        return ResponseEntity
                .badRequest()
                .body(error);
    }

    /**
     * Handles Spring Security authentication failures.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(
            AuthenticationException ex,
            HttpServletRequest request
    ) {
        log.warn(
                "Authentication failed: path={}, type={}",
                request.getRequestURI(),
                ex.getClass().getSimpleName()
        );

        ApiError error = buildError(
                ErrorCode.AUTHENTICATION_FAILED,
                HttpStatus.UNAUTHORIZED,
                "Authentication failed.",
                request,
                List.of()
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(error);
    }

    /**
     * Handles authentication service failures.
     */
    @ExceptionHandler(AuthenticationServiceException.class)
    public ResponseEntity<ApiError> handleAuthenticationServiceException(
            AuthenticationServiceException ex,
            HttpServletRequest request
    ) {
        log.error(
                "Authentication service error: path={}",
                request.getRequestURI(),
                ex
        );

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
        log.warn(
                "Access denied: path={}",
                request.getRequestURI()
        );

        ApiError error = buildError(
                ErrorCode.ACCESS_DENIED,
                HttpStatus.FORBIDDEN,
                "You do not have permission to access this resource.",
                request,
                List.of()
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(error);
    }

    /**
     * Handles unsupported HTTP methods.
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex,
            HttpServletRequest request
    ) {
        log.debug(
                "HTTP method not supported: method={}, path={}",
                request.getMethod(),
                request.getRequestURI()
        );

        ApiError error = buildError(
                ErrorCode.INVALID_REQUEST,
                HttpStatus.METHOD_NOT_ALLOWED,
                "The HTTP method is not supported for this resource.",
                request,
                List.of()
        );

        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(error);
    }

    /**
     * Handles unexpected application errors.
     *
     * Never exposes the original exception message to the client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpectedException(
            Exception ex,
            HttpServletRequest request
    ) {
        String traceId = UUID.randomUUID().toString();

        log.error(
                "Unexpected error: traceId={}, method={}, path={}",
                traceId,
                request.getMethod(),
                request.getRequestURI(),
                ex
        );

        ApiError error = new ApiError(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                ErrorCode.INTERNAL_ERROR.name(),
                "An unexpected error occurred.",
                request.getRequestURI(),
                traceId,
                List.of()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    private ResponseEntity<ApiError> buildInternalServerError(
            HttpServletRequest request
    ) {
        String traceId = UUID.randomUUID().toString();

        ApiError error = new ApiError(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                ErrorCode.INTERNAL_ERROR.name(),
                "An unexpected error occurred.",
                request.getRequestURI(),
                traceId,
                List.of()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
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
                getTraceId(),
                details
        );
    }

    private ApiError.FieldError mapFieldError(FieldError error) {
        return new ApiError.FieldError(
                error.getField(),
                error.getDefaultMessage()
        );
    }

    private String getTraceId() {
        return UUID.randomUUID().toString();
    }
}