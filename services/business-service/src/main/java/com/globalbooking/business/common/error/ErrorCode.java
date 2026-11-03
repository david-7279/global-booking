package com.globalbooking.business.common.error;

public enum ErrorCode {

    // Request / Validation
    VALIDATION_ERROR,
    INVALID_REQUEST,

    // Authentication
    AUTHENTICATION_FAILED,
    INVALID_CREDENTIALS,
    TOKEN_INVALID,
    TOKEN_EXPIRED,

    // Authorization
    ACCESS_DENIED,

    // User
    USER_NOT_FOUND,
    USER_ALREADY_EXISTS,
    BUSINESS_NOT_FOUND,
    ESTABLISHMENT_NOT_FOUND,
    BOOKING_SERVICE_NOT_FOUND,
    RESOURCE_NOT_FOUND,
    EVENT_INVALID,

    // System
    INTERNAL_ERROR
}
