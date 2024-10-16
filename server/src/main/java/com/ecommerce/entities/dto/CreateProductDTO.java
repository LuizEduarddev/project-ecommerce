package com.ecommerce.entities.dto;

import org.springframework.web.multipart.MultipartFile;

public class CreateProductDTO {
    private String nomeProd;
    private double precoProd;
    private boolean promoProd;
    private String categoriaProd;
    private double precoPromocao;
    private MultipartFile file;
    private boolean visible;
    private String token;

    // Default constructor
    public CreateProductDTO() {}

    // Parameterized constructor
    public CreateProductDTO(String nomeProd, double precoProd, boolean promoProd,
                            String categoriaProd, double precoPromocao, MultipartFile file, boolean visible, String token) {
        this.nomeProd = nomeProd;
        this.precoProd = precoProd;
        this.promoProd = promoProd;
        this.categoriaProd = categoriaProd;
        this.precoPromocao = precoPromocao;
        this.file = file;
        this.visible = visible;
        this.token = token;
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

    public double getPrecoPromocao() {
        return precoPromocao;
    }

    public void setPrecoPromocao(double precoPromocao) {
        this.precoPromocao = precoPromocao;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}