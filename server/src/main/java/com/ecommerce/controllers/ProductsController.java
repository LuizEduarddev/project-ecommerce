package com.ecommerce.controllers;

import java.util.List;

import com.ecommerce.entities.dto.CreateProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entities.Products;
import com.ecommerce.services.ProductsService;

@RestController
@RequestMapping("/api/products")
public class ProductsController {
	
	@Autowired
	private ProductsService service;
	
	@GetMapping("/get-all")
	public List<Products> getAll()
	{
		return service.getAllProducts();
	}

	@GetMapping("/get-promotion")
	public List<Products> getPromotion()
	{
		return service.getProductsPromotion();
	}

	@PostMapping("/get-by-id-{id}")
	public Products getById(@PathVariable String id) throws Exception
	{
		return service.getProductById(id);
	}
	
	@PostMapping("/add")
	public ResponseEntity<String> add(@ModelAttribute CreateProductDTO produto)
	{
		return service.addProduct(produto);
	}
	
	@PutMapping("/alter-{id}")
	public ResponseEntity<String> alter(@PathVariable String id, @RequestBody Products alterProduto) throws Exception
	{
		return service.alterProduct(id, alterProduto);
	}
	
	@DeleteMapping("/delete-{id}")
	public ResponseEntity<String> delete(@PathVariable String id) throws Exception
	{
		return service.deleteProduto(id);
	}
}
