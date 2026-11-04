package com.globalbooking.notification.shared.common.error;

public enum ErrorCode {

    // Request / Validation
    VALIDATION_ERROR,
    INVALID_REQUEST,

    // Authentication
    AUTHENTICATION_FAILED,
    TOKEN_INVALID,
    TOKEN_EXPIRED,

    // Authorization
    ACCESS_DENIED,

    // Resource
    ENDPOINT_NOT_FOUND,

    // Notification domain
    NOTIFICATION_NOT_FOUND,
    NOTIFICATION_NOT_RETRYABLE,
    TEMPLATE_NOT_FOUND,
    TEMPLATE_ALREADY_EXISTS,
    TEMPLATE_RENDERING_FAILED,

    // Messaging / delivery
    EVENT_INVALID,
    RECIPIENT_UNAVAILABLE,
    EMAIL_DELIVERY_FAILED,

    // System
    INTERNAL_ERROR
}
