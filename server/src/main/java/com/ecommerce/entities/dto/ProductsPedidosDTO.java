package com.ecommerce.entities.dto;


import com.ecommerce.entities.Products;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductsPedidosDTO {

    @Id
    private Long id;

    @ManyToOne
    private Products produto;

    private int quantidade;

    public ProductsPedidosDTO(){}

    public ProductsPedidosDTO(Products product, int quantity) {
        this.produto = product;
        this.quantidade = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
