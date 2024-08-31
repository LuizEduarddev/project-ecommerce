package com.ecommerce.controllers;

import java.util.List;
import java.util.Optional;

import com.ecommerce.entities.CategoriaProd;
import com.ecommerce.entities.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entities.Products;
import com.ecommerce.services.ProductsService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
public class ProductsController {
	
	@Autowired
	private ProductsService service;

	@GetMapping("/get-categories")
	public List<String> getAllCategories()
	{
		return service.getCategories();
	}

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

	@PostMapping("/search")
	public List<Products> search(@RequestBody String pesquisa){
		return service.searchProduct(pesquisa);
	}

	//todo -> need add filter to only return if the user are == balcao
	//ESTA FUNCAO E NECESSARIA POIS AQUI PUXA TODOS OS PRODUTOS MESMO QUE SEJAM VISIBLE == FALSE
	@PostMapping("/search/balcao")
	public List<Products> searchBalcao(@RequestBody String pesquisa){
		return service.searchProductBalcao(pesquisa);
	}

	@PostMapping("/get-by-id")
	public Products getById(@RequestBody String idProduto) throws Exception
	{
		return service.getProductById(idProduto);
	}

	@PostMapping("/get-by-categoria")
	public List<ProductsCategoriaDTO> getByCategoria(@RequestParam String categoria) throws Exception
	{
		return service.getProductByCategoria(categoria);
	}

	@PostMapping("/add")
	public ResponseEntity<String> add(
			@RequestParam("nomeProd") String nomeProd,
			@RequestParam("precoProd") double precoProd,
			@RequestParam("promoProd") boolean promoProd,
			@RequestParam("categoriaProd") CategoriaProd categoriaProd,
			@RequestParam("precoPromocao") double precoPromocao,
			@RequestPart(value = "file", required = false) MultipartFile file,
			@RequestParam("visible") boolean visible
	) {
		CreateProductDTO novoProduto = new CreateProductDTO(nomeProd, precoProd, promoProd, categoriaProd, precoPromocao, file, visible);
		return service.addProduct(novoProduto);
	}
	
	@PutMapping("/editar")
	public ResponseEntity<String> alter(@RequestParam("idProd") String idProd,
										@RequestParam("nomeProd") String nomeProd,
										@RequestParam("precoProd") double precoProd,
										@RequestParam("promoProd") boolean promoProd,
										@RequestParam("categoriaProd") CategoriaProd categoriaProd,
										@RequestParam("precoPromocao") double precoPromocao,
										@RequestPart(value = "file", required = false) MultipartFile file,
										@RequestParam("visible") boolean visible
	) throws Exception {
		EditarProductDTO novoProduto = new EditarProductDTO(idProd,nomeProd, precoProd, promoProd, categoriaProd, precoPromocao, file, visible);
		return service.alterProduct(novoProduto);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<String> delete(@RequestParam String idProduto) throws Exception
	{
		return service.deleteProduto(idProduto);
	}
}
