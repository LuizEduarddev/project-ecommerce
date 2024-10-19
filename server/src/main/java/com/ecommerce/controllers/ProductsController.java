package com.ecommerce.controllers;

import java.util.List;

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
	public List<Products> search(@RequestParam PesquisaProdutoDTO dto){
		return service.searchProduct(dto);
	}

	//ESTA FUNCAO E NECESSARIA POIS AQUI PUXA TODOS OS PRODUTOS MESMO QUE SEJAM VISIBLE == FALSE
	@PostMapping("/search/balcao")
	public List<Products> searchBalcao(@RequestParam PesquisaProdutoDTO pesquisa){
		return service.searchProductBalcao(pesquisa);
	}

	@PostMapping("/get-by-id")
	public Products getById(@RequestParam	 String idProduto) throws Exception
	{
		return service.getProductById(idProduto);
	}

	@PostMapping("/get-by-categoria")
	public List<ProductsCategoriaDTO> getByCategoria(@RequestBody CategoriariaProdutoDTO dto) throws Exception
	{
		return service.getProductByCategoria(dto);
	}

	@PostMapping("/add")
	public ResponseEntity<String> add(
			@RequestParam("nomeProd") String nomeProd,
			@RequestParam("precoProd") double precoProd,
			@RequestParam("promoProd")	 boolean promoProd,
			@RequestParam("categoriaProd") String categoriaProd,
			@RequestParam("precoPromocao") double precoPromocao,
			@RequestPart(value = "file", required = false) MultipartFile file,
			@RequestParam("visible") boolean visible,
			@RequestParam("token") String token
	) {
		CreateProductDTO novoProduto = new CreateProductDTO(nomeProd, precoProd, promoProd, categoriaProd, precoPromocao, file, visible, token);
		return service.addProduct(novoProduto);
	}
	
	@PutMapping("/editar")
	public ResponseEntity<String> alter(@RequestParam("idProd") String idProd,
										@RequestParam("nomeProd") String nomeProd,
										@RequestParam("precoProd") double precoProd,
										@RequestParam("promoProd") boolean promoProd,
										@RequestParam("categoriaProd") String categoriaProd,
										@RequestParam("precoPromocao") double precoPromocao,
										@RequestPart(value = "file", required = false) MultipartFile file,
										@RequestParam("visible") boolean visible,
										@RequestParam("visible") String token
	) throws Exception {
		EditarProductDTO novoProduto = new EditarProductDTO(idProd,nomeProd, precoProd, promoProd, categoriaProd, precoPromocao, file, visible, token);
		return service.alterProduct(novoProduto);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<String> delete(@RequestParam String idProduto) throws Exception
	{
		return service.deleteProduto(idProduto);
	}
}
