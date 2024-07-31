package com.ecommerce.entities.dto;

import org.springframework.web.multipart.MultipartFile;

public class CreateProductDTO {
    private String nomeProd;
    private double precoProd;
    private boolean promoProd;
    private String categoriaProd;
    private String precoPromocao;
    private MultipartFile file;

    // Default constructor
    public CreateProductDTO() {}

    // Parameterized constructor
    public CreateProductDTO(String nomeProd, double precoProd, boolean promoProd,
                            String categoriaProd, String precoPromocao, MultipartFile file) {
        this.nomeProd = nomeProd;
        this.precoProd = precoProd;
        this.promoProd = promoProd;
        this.categoriaProd = categoriaProd;
        this.precoPromocao = precoPromocao;
        this.file = file;
    }

    // Getters and Setters
    public String getNomeProd() {
        return nomeProd;
    }

    public void setNomeProd(String nomeProd) {
        this.nomeProd = nomeProd;
    }

    public double getPrecoProd() {
        return precoProd;
    }

    public void setPrecoProd(double precoProd) {
        this.precoProd = precoProd;
    }

    public boolean isPromoProd() {
        return promoProd;
    }

    public void setPromoProd(boolean promoProd) {
        this.promoProd = promoProd;
    }

    public String getCategoriaProd() {
        return categoriaProd;
    }

    public void setCategoriaProd(String categoriaProd) {
        this.categoriaProd = categoriaProd;
    }

    public String getPrecoPromocao() {
        return precoPromocao;
    }

    public void setPrecoPromocao(String precoPromocao) {
        this.precoPromocao = precoPromocao;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}