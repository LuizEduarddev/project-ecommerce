package com.ecommerce.entities.errors;

public class CategoriaEmpresasException extends RuntimeException{
    public CategoriaEmpresasException(String message) {
        super(message);
    }

    @Override
    public Throwable fillInStackTrace() {
        return this;
    }
}
