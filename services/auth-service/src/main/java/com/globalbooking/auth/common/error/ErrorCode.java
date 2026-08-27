package com.globalbooking.auth.common.error;

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

    // System
    INTERNAL_ERROR
}