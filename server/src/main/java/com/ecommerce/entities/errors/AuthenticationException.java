package com.ecommerce.entities.errors;

public class AuthenticationException extends RuntimeException{
    public AuthenticationException(String message) {
        super(message);
    }

    @Override
    public Throwable fillInStackTrace() {
        return this;
    }

}

