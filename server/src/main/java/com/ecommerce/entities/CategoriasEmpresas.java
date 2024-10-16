package com.ecommerce.entities;

import jakarta.persistence.*;

@Table(name = "categorias")
@Entity(name = "categorias")
public class CategoriasEmpresas {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idCategoriaEmpresa;

    @Column(name = "nome_categoria_empresa", nullable = false)
    private String nomeCategoriaEmpresa;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Empresas empresa;

    public CategoriasEmpresas()
    {

    }

    public CategoriasEmpresas(String nomeCategoriaEmpresa, Empresas empresa) {
        this.nomeCategoriaEmpresa = nomeCategoriaEmpresa;
        this.empresa = empresa;
    }

    public String getIdCategoriaEmpresa() {
        return idCategoriaEmpresa;
    }

    public void setIdCategoriaEmpresa(String idCategoriaEmpresa) {
        this.idCategoriaEmpresa = idCategoriaEmpresa;
    }

    public String getNomeCategoriaEmpresa() {
        return nomeCategoriaEmpresa;
    }

    public void setNomeCategoriaEmpresa(String nomeCategoriaEmpresa) {
        this.nomeCategoriaEmpresa = nomeCategoriaEmpresa;
    }

    public Empresas getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresas empresa) {
        this.empresa = empresa;
    }
}
