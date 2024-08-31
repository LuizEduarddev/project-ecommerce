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
    @Query("SELECT p FROM products p WHERE LOWER(p.nomeProd) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Products> findByNomeProdContainingIgnoreCase(@Param("query") String query);

    List<Products> findByCategoriaProd(CategoriaProd categoriaProd);
}
