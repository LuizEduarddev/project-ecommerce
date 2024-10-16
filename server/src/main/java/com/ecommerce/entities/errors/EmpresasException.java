package com.ecommerce.entities.errors;

public class EmpresasException extends RuntimeException{
    public EmpresasException(String message) {
        super(message);
    }

    @Override
    public Throwable fillInStackTrace() {
        return this;
    }
}
