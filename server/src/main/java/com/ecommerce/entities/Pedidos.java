package com.ecommerce.entities;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Table(name = "pedidos")
@Entity(name = "pedidos")
public class Pedidos {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idPedido;

    @Column(name = "data_pedido")
    private Date dataPedido;

    @Column(name = "hora_pedido")
    private String horaPedido;

    @Column(name = "total_pedido")
    private double totalPedido;

    @Column(name = "pedido_pago")
    private boolean pedidoPago;

    @Column(name = "pedido_pronto")
    private boolean pedidoPronto;

    @OneToMany
    private List<Products> produtos;

    @ManyToOne
    private Users users;

    @ManyToOne
    private Mesa mesa;

    public Pedidos(){}

    public Pedidos(Date dataPedido, String horaPedido, double totalPedido, boolean pedidoPago, boolean pedidoPronto, List<Products> produtos, Users users, Mesa mesa) {
        this.dataPedido = dataPedido;
        this.horaPedido = horaPedido;
        this.totalPedido = totalPedido;
        this.pedidoPago = pedidoPago;
        this.pedidoPronto = pedidoPronto;
        this.produtos = produtos;
        this.users = users;
        this.mesa = mesa;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public List<Products> getProdutos() {
        return produtos;
    }

    public void setProdutos(List<Products> produtos) {
        this.produtos = produtos;
    }

    public boolean isPedidoPronto() {
        return pedidoPronto;
    }

    public void setPedidoPronto(boolean pedidoPronto) {
        this.pedidoPronto = pedidoPronto;
    }

    public boolean isPedidoPago() {
        return pedidoPago;
    }

    public void setPedidoPago(boolean pedidoPago) {
        this.pedidoPago = pedidoPago;
    }

    public double getTotalPedido() {
        return totalPedido;
    }

    public void setTotalPedido(double totalPedido) {
        this.totalPedido = totalPedido;
    }

    public String getHoraPedido() {
        return horaPedido;
    }

    public void setHoraPedido(String horaPedido) {
        this.horaPedido = horaPedido;
    }

    public Date getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(Date dataPedido) {
        this.dataPedido = dataPedido;
    }

    public String getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(String idPedido) {
        this.idPedido = idPedido;
    }

    public Mesa getMesa() {
        return mesa;
    }

    public void setMesa(Mesa mesa) {
        this.mesa = mesa;
    }
}
