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

    @Column(name = "id_pagamento_mercado_pago")
    private Long idPagamentoMercadoPago;

    @ManyToOne
    private Users user;

    @Column(name = "data_pagamento")
    private OffsetDateTime dataPagamento;

    @Column(name = "aprovaddo_em")
    private OffsetDateTime aprovadoEm;

    @Column(name = "pontos_gerados")
    private int pontosGerados;

    @Column(name = "status_pagamento")
    private String statusPagamento;

    @Column(name = "status_detail")
    private String statusDetail;

    @Column(name = "metodo_pagamento")
    private String metodoPagamento;

    @ManyToOne
    private Pedidos pedido;

    @Column(name = "creditado")
    private boolean creditado;

    public Pagamentos() {
    }

    public Pagamentos(Long idPagamentoMercadoPago, Users user, OffsetDateTime dataPagamento, int pontosGerados, String statusPagamento, String metodoPagamento, Pedidos pedido, OffsetDateTime aprovadoEm, boolean creditado) {
        this.idPagamentoMercadoPago = idPagamentoMercadoPago;
        this.user = user;
        this.dataPagamento = dataPagamento;
        this.pontosGerados = pontosGerados;
        this.statusPagamento = statusPagamento;
        this.metodoPagamento = metodoPagamento;
        this.pedido = pedido;
        this.aprovadoEm = aprovadoEm;
        this.creditado = creditado;

    }

    public Pedidos getPedido() {
        return pedido;
    }

    public void setPedido(Pedidos pedido) {
        this.pedido = pedido;
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

    public String getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(String metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public String getStatusDetail() {
        return statusDetail;
    }
    public void setStatusDetail(String statusDetail) {
        this.statusDetail = statusDetail;
    }

    public Long getIdPagamentoMercadoPago() {
        return idPagamentoMercadoPago;
    }

    public void setIdPagamentoMercadoPago(Long idPagamentoMercadoPago) {
        this.idPagamentoMercadoPago = idPagamentoMercadoPago;
    }

    public OffsetDateTime getAprovadoEm() {
        return aprovadoEm;
    }

    public void setAprovadoEm(OffsetDateTime aprovadoEm) {
        this.aprovadoEm = aprovadoEm;
    }

    public boolean isCreditado() {
        return creditado;
    }

    public void setCreditado(boolean creditado) {
        this.creditado = creditado;
    }
}