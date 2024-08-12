package com.ecommerce.repository;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Pagamentos;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PagamentosRepository extends JpaRepository<Pagamentos, String> {
}