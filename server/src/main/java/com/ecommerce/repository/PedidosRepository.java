package com.ecommerce.repository;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidosRepository extends JpaRepository<Pedidos, String> {
    List<Pedidos> findByUsers(Users token);
    List<Pedidos> findByMesa(Mesa mesa);
    List<Pedidos> findByUsersAndMesa(Users users, Mesa mesa);
    List<Pedidos> findByUsersAndMesaAndPedidoPagoFalse(Users user, Mesa mesa);
}
