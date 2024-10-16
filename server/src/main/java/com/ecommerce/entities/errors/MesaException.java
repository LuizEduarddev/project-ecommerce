package com.ecommerce.entities.errors;

public class MesaException extends RuntimeException{
    public MesaException(String message) {
        super(message);
    }

    @Override
    public Throwable fillInStackTrace() {
        return this;
    }
}
