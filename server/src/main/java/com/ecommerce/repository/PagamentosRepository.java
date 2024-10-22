package com.ecommerce.repository;

import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.Pagamentos;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagamentosRepository extends JpaRepository<Pagamentos, String> {
    Pagamentos findByPedido(Pedidos pedido);
    List<Pagamentos> findByEmpresa(Empresas empresa);

    Pagamentos findByIdPagamentoAndEmpresa(String id, Empresas empresa);
}