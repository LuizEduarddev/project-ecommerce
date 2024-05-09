package com.ecommerce.repository;

import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidosRepository extends JpaRepository<Pedidos, String> {
    List<Pedidos> findByUsers(Users token);
}
