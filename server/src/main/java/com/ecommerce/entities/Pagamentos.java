package com.ecommerce.entities;

import com.mercadopago.resources.payment.PaymentMethod;
import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Table(name = "pagamentos")
@Entity(name = "pagamentos")
public class Pagamentos {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idPagamento;

    @ManyToMany
    private Users user;

    @Column(name = "data_pagamento")
    private OffsetDateTime dataPagamento;

    @Column(name = "pontos_gerados")
    private int pontosGerados;

    @Column(name = "status_pagamento")
    private String statusPagamento;

    @Column(name = "metodo_pagamento")
    private PaymentMethod metodoPagamento;

    public Pagamentos() {
    }

    public Pagamentos(Users user, OffsetDateTime dateApproved, int pontos, String status, PaymentMethod paymentMethod) {
    }

    public String getIdPagamento() {
        return idPagamento;
    }

    public void setIdPagamento(String idPagamento) {
        this.idPagamento = idPagamento;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public OffsetDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(OffsetDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public int getPontosGerados() {
        return pontosGerados;
    }

    public void setPontosGerados(int pontosGerados) {
        this.pontosGerados = pontosGerados;
    }

    public String getStatusPagamento() {
        return statusPagamento;
    }

    public void setStatusPagamento(String statusPagamento) {
        this.statusPagamento = statusPagamento;
    }

    public PaymentMethod getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(PaymentMethod metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }
}