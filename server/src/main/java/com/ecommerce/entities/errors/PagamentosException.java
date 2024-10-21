package com.ecommerce.entities.errors;

public class PagamentosException extends RuntimeException{
    public PagamentosException(String message) {
        super(message);
    }

    @Override
    public Throwable fillInStackTrace() {
        return this;
    }
}
