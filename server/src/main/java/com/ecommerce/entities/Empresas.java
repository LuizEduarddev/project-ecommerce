package com.ecommerce.entities;

import jakarta.persistence.*;

@Table(name = "empresas")
@Entity(name = "empresas")
public class Empresas {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idEmpresa;

    @Column(name = "cnpf_empresa", unique = true)
    private String cnpjEmpresa;

    @Column(name = "cpf_empresa", unique = true)
    private String cpfEmpresa;

    @Column(name = "data_cadastro")
    private String dataCadastro;

    @Column(name = "nomeFantasia", unique = true)
    private String nomeFantasia;

    @Column(name = "cidade_empresa")
    private String cidadeEmpresa;

    public Empresas()
    {}

    public Empresas(String cnpjEmpresa, String dataCadastro, String nomeFantasia, String cidadeEmpresa, String cpfEmpresa) {
        this.cnpjEmpresa = cnpjEmpresa;
        this.dataCadastro = dataCadastro;
        this.nomeFantasia = nomeFantasia;
        this.cidadeEmpresa = cidadeEmpresa;
        this.cpfEmpresa = cpfEmpresa;
    }

    public String getIdEmpresa() {
        return idEmpresa;
    }

    public void setIdEmpresa(String idEmpresa) {
        this.idEmpresa = idEmpresa;
    }

    public String getCnpjEmpresa() {
        return cnpjEmpresa;
    }

    public void setCnpjEmpresa(String cnpjEmpresa) {
        this.cnpjEmpresa = cnpjEmpresa;
    }

    public String getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(String dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getNomeFantasia() {
        return nomeFantasia;
    }

    public void setNomeFantasia(String nomeFantasia) {
        this.nomeFantasia = nomeFantasia;
    }

    public String getCidadeEmpresa() {
        return cidadeEmpresa;
    }

    public void setCidadeEmpresa(String cidadeEmpresa) {
        this.cidadeEmpresa = cidadeEmpresa;
    }

    public String getCpfEmpresa() {
        return cpfEmpresa;
    }

    public void setCpfEmpresa(String cpfEmpresa) {
        this.cpfEmpresa = cpfEmpresa;
    }
}

