package com.ecommerce.entities.errors;

public class PedidoException extends RuntimeException{
    public PedidoException(String message) {
        super(message);
    }

    @Override
    public Throwable fillInStackTrace() {
        return this;
    }
}
