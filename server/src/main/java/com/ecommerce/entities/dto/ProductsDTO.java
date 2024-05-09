package com.ecommerce.entities.dto;

public record ProductsDTO(String idProd, String nomeProd, int quantidade, int valorTotalIten) {
    @Override
    public String idProd() {
        return idProd;
    }

    @Override
    public String nomeProd() {
        return nomeProd;
    }

    @Override
    public int quantidade() {
        return quantidade;
    }
}
