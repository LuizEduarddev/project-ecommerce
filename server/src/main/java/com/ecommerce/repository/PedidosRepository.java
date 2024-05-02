package com.ecommerce.repository;

import com.ecommerce.entities.Pedidos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidosRepository extends JpaRepository<Pedidos, String> {
}
