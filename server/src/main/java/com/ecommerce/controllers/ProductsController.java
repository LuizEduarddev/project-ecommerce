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

	@GetMapping("/get-all")
	public List<Products> getAll()
	{
		return service.getAllProducts();
	}

	@PostMapping("/get-promotion")
	public List<Products> getPromotion(String token)
	{
		return service.getProductsPromotion(token);
	}

	@PostMapping("/search")
	public List<Products> search(@RequestBody PesquisaProdutoDTO dto){
		return service.searchProduct(dto);
	}

	//ESTA FUNCAO E NECESSARIA POIS AQUI PUXA TODOS OS PRODUTOS MESMO QUE SEJAM VISIBLE == FALSE
	@PostMapping("/search/balcao")
	public List<Products> searchBalcao(@RequestBody PesquisaProdutoDTO dto){
		return service.searchProductBalcao(dto);
	}

	@PostMapping("/get-by-id")
	public ProductsEmpresaDTO getById(@RequestParam  String idProduto, @RequestParam String token) throws Exception
	{
		return service.getProductById(idProduto, token);
	}

	@PostMapping("/get-by-categoria")
	public List<ProductsCategoriaDTO> getByCategoria(@RequestBody CategoriariaProdutoDTO dto) throws Exception
	{
		return service.getProductByCategoria(dto);
	}

	@PostMapping("/get-by-empresa")
	public List<ProductsEmpresaDTO> getByEmpresa(@RequestParam String token)
	{
		return service.getProductByEmpresa(token);
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
										@RequestParam("token") String token
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
