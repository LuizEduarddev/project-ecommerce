package com.ecommerce.entities.dto;

import com.ecommerce.entities.CategoriaProd;
import org.springframework.web.multipart.MultipartFile;

public class EditarProductDTO {
    private String idProduto;
    private String nomeProd;
    private double precoProd;
    private boolean promoProd;
    private CategoriaProd categoriaProd;
    private double precoPromocao;
    private MultipartFile file;
    private boolean visible;

    // Default constructor
    public EditarProductDTO() {}

    // Parameterized constructor
    public EditarProductDTO(String idProduto,String nomeProd, double precoProd, boolean promoProd,
                            CategoriaProd categoriaProd, double precoPromocao, MultipartFile file, boolean visible) {
        this.idProduto = idProduto;
        this.nomeProd = nomeProd;
        this.precoProd = precoProd;
        this.promoProd = promoProd;
        this.categoriaProd = categoriaProd;
        this.precoPromocao = precoPromocao;
        this.file = file;
        this.visible = visible;
    }

    public String getIdProduto() {
        return idProduto;
    }

    public void setIdProduto(String idProduto) {
        this.idProduto = idProduto;
    }

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

    public CategoriaProd getCategoriaProd() {
        return categoriaProd;
    }

    public void setCategoriaProd(CategoriaProd categoriaProd) {
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
}