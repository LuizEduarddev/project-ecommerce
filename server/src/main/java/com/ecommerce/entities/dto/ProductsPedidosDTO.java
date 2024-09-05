package com.ecommerce.entities.dto;


import com.ecommerce.entities.Products;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Embeddable
public class ProductsPedidosDTO {

    @ManyToOne
    private Products produto;

    private int quantidade;

    public ProductsPedidosDTO(){}

    public ProductsPedidosDTO(Products product, int quantity) {
        this.produto = product;
        this.quantidade = quantity;
    }

    public Products getProduto() {
        return produto;
    }

    public void setProduto(Products product) {
        this.produto = product;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantity) {
        this.quantidade = quantity;
    }
}
