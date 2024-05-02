package com.ecommerce.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	
	@PostMapping("/get-by-id-{id}")
	public Products getById(@PathVariable String id) throws Exception
	{
		return service.getProductById(id);
	}
	
	@PostMapping("/add")
	public ResponseEntity<String> add(@RequestBody Products produto)
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
