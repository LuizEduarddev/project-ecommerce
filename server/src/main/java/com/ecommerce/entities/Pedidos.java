package com.ecommerce.entities;

import com.ecommerce.entities.dto.ProductsDTO;
import com.ecommerce.entities.dto.ProductsPedidosDTO;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Table(name = "pedidos")
@Entity(name = "pedidos")
public class Pedidos {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idPedido;

    @Column(name = "data_pedido")
    private String dataPedido;

    @Column(name = "hora_pedido")
    private String horaPedido;

    @Column(name = "total_pedido")
    private double totalPedido;

    @Column(name = "pedido_pago")
    private boolean pedidoPago;

    @Column(name = "pedido_pronto")
    private boolean pedidoPronto;

    @ElementCollection
    @CollectionTable(name = "pedido_produtos", joinColumns = @JoinColumn(name = "pedido_id"))
    private List<ProductsPedidosDTO> produtos = new ArrayList<>();


    @ManyToOne
    private Users users;

    @ManyToOne
    private Mesa mesa;

    public Pedidos(){}

    public Pedidos(String dataPedido, String horaPedido, double totalPedido, boolean pedidoPago, boolean pedidoPronto, List<ProductsPedidosDTO> produtos, Users users) {
        this.dataPedido = dataPedido;
        this.horaPedido = horaPedido;
        this.totalPedido = totalPedido;
        this.pedidoPago = pedidoPago;
        this.pedidoPronto = pedidoPronto;
        this.produtos = produtos;
        this.users = users;
    }

    public Pedidos(String dataPedido, String horaPedido, double totalPedido, boolean pedidoPago, boolean pedidoPronto, List<ProductsPedidosDTO> produtos, Users users, Mesa mesa) {
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

    public List<ProductsPedidosDTO> getProdutos() {
        return produtos;
    }

    public void setProdutos(List<ProductsPedidosDTO> produtos) {
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

    public String getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(String dataPedido) {
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
