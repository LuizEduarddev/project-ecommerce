package com.ecommerce.repository;

import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidosRepository extends JpaRepository<Pedidos, String> {
    List<Pedidos> findByUsers(Users token);
    List<Pedidos> findByMesaAndEmpresa(Mesa mesa, Empresas empresa);
    List<Pedidos> findByUsersAndMesa(Users users, Mesa mesa);
    List<Pedidos> findByUsersAndMesaAndPedidoPagoFalse(Users user, Mesa mesa);
    List<Pedidos> findByCpfClientePedidoAndEmpresa(String cpfClientePedido, Empresas empresa);
    List<Pedidos> findByDataPedido(String dataPedido);
    List<Pedidos> findByEmpresa(Empresas empresa);
    Pedidos findByIdPedidoAndEmpresa(String idPedido, Empresas empresa);

}
