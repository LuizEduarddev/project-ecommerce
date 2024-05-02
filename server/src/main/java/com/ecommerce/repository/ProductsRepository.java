package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entities.Products;

public interface ProductsRepository extends JpaRepository<Products, String>{

}
