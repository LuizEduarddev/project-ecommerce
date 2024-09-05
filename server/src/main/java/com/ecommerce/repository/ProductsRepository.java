package com.ecommerce.repository;

import com.ecommerce.entities.CategoriaProd;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entities.Products;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductsRepository extends JpaRepository<Products, String> {
    List<Products> findByNomeProdContaining(@Param("query") String query);

    List<Products> findByCategoriaProd(CategoriaProd categoriaProd);
}
