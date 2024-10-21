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

    @Column(name = "cpf_user_pagamento")
    private String cpfUserPagamento;

    @Column(name = "data_pagamento")
    private String dataPagamento;

    @Column(name = "metodo_pagamento")
    @Enumerated(EnumType.STRING)
    private MetodoPagamento metodoPagamento;

    @ManyToOne
    private Pedidos pedido;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Empresas empresa;

    public Pagamentos() {
    }

    public Pagamentos(String cpfUserPagamento, String dataPagamento, MetodoPagamento metodoPagamento, Pedidos pedido, Empresas empresa) {
        this.cpfUserPagamento = cpfUserPagamento;
        this.dataPagamento = dataPagamento;
        this.metodoPagamento = metodoPagamento;
        this.pedido = pedido;
        this.empresa = empresa;
    }

    public String getIdPagamento() {
        return idPagamento;
    }

    public void setIdPagamento(String idPagamento) {
        this.idPagamento = idPagamento;
    }

    public String getCpfUserPagamento() {
        return cpfUserPagamento;
    }

    public void setCpfUserPagamento(String cpfUserPagamento) {
        this.cpfUserPagamento = cpfUserPagamento;
    }

    public String getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(String dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public MetodoPagamento getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public Pedidos getPedido() {
        return pedido;
    }

    public void setPedido(Pedidos pedido) {
        this.pedido = pedido;
    }

    public Empresas getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresas empresa) {
        this.empresa = empresa;
    }
}