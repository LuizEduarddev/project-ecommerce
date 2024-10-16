package com.ecommerce.entities.errors;

public class ProductsException extends RuntimeException{
    public ProductsException(String message) {
        super(message);
    }

    @Override
    public Throwable fillInStackTrace() {
        return this;
    }
}
