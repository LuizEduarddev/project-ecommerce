package com.ecommerce.entities;

import com.ecommerce.entities.dto.ProductsPedidosDTO;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Table(name = "pedidos")
@Entity(name = "pedidos")
public class Pedidos {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idPedido;

    @Column(name = "cpf_cliente_pedido")
    private String cpfClientePedido;

    @Column(name = "data_pedido")
    private String dataPedido;

    @Column(name = "hora_pedido")
    private String horaPedido;

    @Column(name = "total_pedido")
    private double totalPedido;

    @Column(name = "pedido_pago")
    private boolean pedidoPago;

    @Column(name = "pedido_pronto_cozinha")
    private boolean pedidoProntoCozinha;

    @Column(name = "pedido_pronto_balcao")
    private boolean pedidoProntoBalcao;

    @Column(name = "pedido_pronto")
    private boolean pedidoPronto;

    @Column(name = "hora_pronto")
    private String horaPronto;

    @Column(name = "levou_para_mesa")
    private boolean levouParaMesa;

    @ElementCollection
    @CollectionTable(name = "pedido_produtos", joinColumns = @JoinColumn(name = "pedido_id"))
    private List<ProductsPedidosDTO> produtos = new ArrayList<>();

    @ManyToOne
    private Users users;

    @ManyToOne
    private Mesa mesa;

    @OneToOne
    @JoinColumn(nullable = false)
    private Empresas empresa;

    public Pedidos(){}

    public Pedidos(String dataPedido, String horaPedido, double totalPedido, boolean pedidoPago, boolean pedidoProntoCozinha, boolean pedidoProntoBalcao, boolean pedidoPronto, List<ProductsPedidosDTO> produtos, Users users) {
        this.dataPedido = dataPedido;
        this.horaPedido = horaPedido;
        this.totalPedido = totalPedido;
        this.pedidoPago = pedidoPago;
        this.pedidoProntoCozinha = pedidoProntoCozinha;
        this.pedidoProntoBalcao = pedidoProntoBalcao;
        this.pedidoPronto = pedidoPronto;
        this.produtos = produtos;
        this.users = users;
    }

    public Pedidos(boolean levouParaMesa, String dataPedido, String horaPedido, String horaPronto, double totalPedido, boolean pedidoPago, boolean pedidoProntoCozinha, boolean pedidoProntoBalcao, boolean pedidoPronto, List<ProductsPedidosDTO> produtos, Users users, Mesa mesa, String cpfClientePedido) {
        this.dataPedido = dataPedido;
        this.horaPedido = horaPedido;
        this.horaPronto = horaPronto;
        this.totalPedido = totalPedido;
        this.pedidoPago = pedidoPago;
        this.pedidoProntoCozinha = pedidoProntoCozinha;
        this.pedidoProntoBalcao = pedidoProntoBalcao;
        this.pedidoPronto = pedidoPronto;
        this.produtos = produtos;
        this.users = users;
        this.mesa = mesa;
        this.cpfClientePedido = cpfClientePedido;
        this.levouParaMesa = levouParaMesa;
    }

    public Pedidos(String cpfClientePedido, String dataPedido, String horaPedido, double totalPedido, boolean pedidoPago, boolean pedidoProntoCozinha, boolean pedidoProntoBalcao, boolean pedidoPronto, String horaPronto, boolean levouParaMesa, List<ProductsPedidosDTO> produtos, Users users, Mesa mesa, Empresas empresa) {
        this.cpfClientePedido = cpfClientePedido;
        this.dataPedido = dataPedido;
        this.horaPedido = horaPedido;
        this.totalPedido = totalPedido;
        this.pedidoPago = pedidoPago;
        this.pedidoProntoCozinha = pedidoProntoCozinha;
        this.pedidoProntoBalcao = pedidoProntoBalcao;
        this.pedidoPronto = pedidoPronto;
        this.horaPronto = horaPronto;
        this.levouParaMesa = levouParaMesa;
        this.produtos = produtos;
        this.users = users;
        this.mesa = mesa;
        this.empresa = empresa;
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

    public boolean isPedidoProntoCozinha() {
        return pedidoProntoCozinha;
    }

    public void setPedidoProntoCozinha(boolean pedidoProntoCozinha) {
        this.pedidoProntoCozinha = pedidoProntoCozinha;
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

    public String getCpfClientePedido() {
        return cpfClientePedido;
    }

    public void setCpfClientePedido(String cpfClientePedido) {
        this.cpfClientePedido = cpfClientePedido;
    }

    public String getHoraPronto() {
        return horaPronto;
    }

    public void setHoraPronto(String horaPronto) {
        this.horaPronto = horaPronto;
    }

    public boolean isPedidoProntoBalcao() {
        return pedidoProntoBalcao;
    }

    public void setPedidoProntoBalcao(boolean pedidoProntoBalcao) {
        this.pedidoProntoBalcao = pedidoProntoBalcao;
    }

    public boolean isPedidoPronto() {
        return pedidoPronto;
    }

    public void setPedidoPronto(boolean pedidoPronto) {
        this.pedidoPronto = pedidoPronto;
    }

    public boolean isLevouParaMesa() {
        return levouParaMesa;
    }

    public void setLevouParaMesa(boolean levouParaMesa) {
        this.levouParaMesa = levouParaMesa;
    }

    public Empresas getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresas empresa) {
        this.empresa = empresa;
    }
}
