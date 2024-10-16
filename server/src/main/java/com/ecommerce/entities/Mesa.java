package com.ecommerce.entities;

import jakarta.persistence.*;

import java.util.List;

@Table(name = "mesa")
@Entity(name = "mesa")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idMesa;

    @Column(name = "numero_mesa", nullable = false, unique = true)
    private int numeroMesa;

    @Column(name = "em_uso", nullable = false)
    private boolean emUso;

    @Column(name = "mesa_suja", nullable = false)
    private boolean mesaSuja;

    @OneToMany
    private List<Users> users;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Empresas empresas;

    public Mesa(){}

    public Mesa(int numeroMesa, boolean emUso, boolean mesaSuja, List<Users> users, Empresas empresas) {
        this.numeroMesa = numeroMesa;
        this.emUso = emUso;
        this.mesaSuja = mesaSuja;
        this.users = users;
        this.empresas = empresas;
    }

    public Mesa(int numeroMesa, boolean emUso, boolean mesaSuja) {
        this.numeroMesa = numeroMesa;
        this.emUso = emUso;
        this.mesaSuja = mesaSuja;
    }

    public Mesa(int numeroMesa, boolean emUso, boolean mesaSuja, List<Users> users) {
        this.numeroMesa = numeroMesa;
        this.emUso = emUso;
        this.mesaSuja = mesaSuja;
        this.users = users;
    }

    public String getIdMesa() {
        return idMesa;
    }

    public void setIdMesa(String idMesa) {
        this.idMesa = idMesa;
    }

    public int getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(int numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public boolean isEmUso() {
        return emUso;
    }

    public void setEmUso(boolean emUso) {
        this.emUso = emUso;
    }

    public boolean isMesaSuja() {
        return mesaSuja;
    }

    public void setMesaSuja(boolean mesaSuja) {
        this.mesaSuja = mesaSuja;
    }

    public List<Users> getIdUsers() {
        return users;
    }

    public void setIdUsers(List<Users> idUsers) {
        this.users = idUsers;
    }

    public Empresas getEmpresas() {
        return empresas;
    }

    public void setEmpresas(Empresas empresas) {
        this.empresas = empresas;
    }
}
