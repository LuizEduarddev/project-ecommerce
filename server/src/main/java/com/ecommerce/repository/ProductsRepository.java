package com.ecommerce.repository;

import com.ecommerce.entities.CategoriasEmpresas;
import com.ecommerce.entities.Empresas;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entities.Products;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductsRepository extends JpaRepository<Products, String> {
    List<Products> findByEmpresaAndNomeProdContaining(Empresas empresa, String query);

    List<Products> findByCategoriaProd(CategoriasEmpresas categoriaProd);
}
