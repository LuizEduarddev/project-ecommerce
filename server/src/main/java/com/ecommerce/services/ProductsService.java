package com.ecommerce.services;

import java.util.*;

import com.ecommerce.entities.CategoriaProd;
import com.ecommerce.entities.dto.CreateProductDTO;
import com.ecommerce.entities.dto.EditarProductDTO;
import com.ecommerce.entities.dto.ProductsCategoriaDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ecommerce.entities.Products;
import com.ecommerce.repository.ProductsRepository;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductsService {
	
	@Autowired
	private ProductsRepository repository;
	
	public List<Products> getAllProducts()
	{
		return repository.findAll();
	}
	
	public Products getProductById(String id) throws Exception
	{
		return repository.findById(id)
				.orElseThrow(() -> new Exception("Produto com id '" + id + "' nao encontrado"));
	}

	public ResponseEntity<String> addProduct(CreateProductDTO novoProduto) {
		if (CategoriaProd.isValidCategoria(novoProduto.getCategoriaProd().toString().toUpperCase()))
		{
			if (novoProduto.isPromoProd() && (novoProduto.getPrecoProd() <= novoProduto.getPrecoPromocao() || novoProduto.getPrecoPromocao() == 0))
			{
				return ResponseEntity.internalServerError().body("Promoção inválida.");
			}
			if (!novoProduto.getFile().isEmpty())
			{
				try {
					MultipartFile file = novoProduto.getFile();
					byte[] imageData = file.getBytes();
					Products product = new Products(
							novoProduto.getNomeProd().toUpperCase(),
							novoProduto.getPrecoProd(),
							novoProduto.isPromoProd(),
							novoProduto.getCategoriaProd(),
							novoProduto.getPrecoPromocao(),
							imageData,
							novoProduto.isVisible()
					);
					repository.saveAndFlush(product);
					return new ResponseEntity<>("Produto cadastrado com sucesso.", HttpStatus.CREATED);
				} catch (Exception e) {
					return new ResponseEntity<>("Falha ao tentar cadastrar o produto.\nERROR: " + e, HttpStatus.BAD_REQUEST);
				}
			}
			else{
				return addProductWithoutFoto(novoProduto);
			}
		}
		else{
			throw new RuntimeException("É necessário uma categoria válida");
		}
	}

	private ResponseEntity<String> addProductWithoutFoto(CreateProductDTO novoProduto) {
		try {
			Products product = new Products(
					novoProduto.getNomeProd(),
					novoProduto.getPrecoProd(),
					novoProduto.isPromoProd(),
					novoProduto.getCategoriaProd(),
					novoProduto.getPrecoPromocao(),
					novoProduto.isVisible()
			);
			repository.saveAndFlush(product);
			return new ResponseEntity<>("Produto cadastrado com sucesso.", HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>("Falha ao tentar cadastrar o produto.\nERROR: " + e, HttpStatus.BAD_REQUEST);
		}
	}

	public ResponseEntity<String> alterProduct(EditarProductDTO dto) throws Exception {
		Products produto = repository.findById(dto.getIdProduto())
				.orElseThrow(() -> new Exception("Produto com id '" + dto.getIdProduto() + "' nao encontrado."));
		if (dto.isPromoProd() && (dto.getPrecoProd() <= dto.getPrecoPromocao() || dto.getPrecoPromocao() == 0))
		{
			return ResponseEntity.internalServerError().body("Promoção inválida.");
		}
		if (dto.getFile() == null)
		{
			produto.setNomeProd(dto.getNomeProd());

			produto.setPrecoProd(dto.getPrecoProd());
			produto.setPromoProd(dto.isPromoProd());
			produto.setCategoriaProd(dto.getCategoriaProd());
			produto.setPrecoPromocao(dto.getPrecoPromocao());
			produto.setVisible(dto.isVisible());
			repository.saveAndFlush(produto);
			return new ResponseEntity<>("Produto alterado com sucesso.", HttpStatus.CREATED);
		}
		else {
			try
			{
				MultipartFile file = dto.getFile();
				byte[] imageData = file.getBytes();
				produto.setNomeProd(dto.getNomeProd());

				produto.setPrecoProd(dto.getPrecoProd());
				produto.setPromoProd(dto.isPromoProd());
				produto.setCategoriaProd(dto.getCategoriaProd());
				produto.setPrecoPromocao(dto.getPrecoPromocao());
				produto.setImagemProduto(imageData);
				produto.setVisible(dto.isVisible());
				repository.saveAndFlush(produto);
				return new ResponseEntity<>("Produto alterado com sucesso.", HttpStatus.CREATED);
			}
			catch(Exception e)
			{
				throw new RuntimeException("Falha ao tentar alterar o produto: " + e);
			}
		}
	}
	
	public ResponseEntity<String> deleteProduto(String id) throws Exception
	{
		Products produto = repository.findById(id)
				.orElseThrow(() -> new Exception("Falha ao deletar o produto.\nProduto com id '" + id + "' nao encontrado"));
		String nomeProduto = produto.getNomeProd();
		
		repository.deleteById(id);
		return new ResponseEntity<>("Produto '" + nomeProduto + "' deletado com sucesso.", HttpStatus.ACCEPTED);
	}

    public List<Products> getProductsPromotion() {
		List<Products> products = repository.findAll();
		List<Products> promocao = new ArrayList<>();
        for (Products produto : products) {
            if (produto.isPromoProd()) {
                promocao.add(produto);
            }
        }
        return promocao;
    }

	@Transactional
	public List<Products> searchProduct(String pesquisa) {
		List<Products> produtosList = repository.findByNomeProdContainingIgnoreCase(pesquisa);
		List<Products> produtosReturn = new ArrayList<>();
		for (Products produto : produtosList) {
			if (produto.isVisible()) {
				produtosReturn.add(produto);
			}
		}

		if (produtosReturn.isEmpty()) {
			return null;
		}

		return produtosReturn;
	}

	@Transactional
	public List<Products> searchProductBalcao(String pesquisa) {
		List<Products> produtosList = repository.findByNomeProdContainingIgnoreCase(pesquisa.toUpperCase());
		if (!produtosList.isEmpty())
		{
			return produtosList;
		}
		else{
			return null;
		}
	}

	public List<String> getCategories() {
		return CategoriaProd.allCategorias();
	}

	@Transactional
	public List<ProductsCategoriaDTO> getProductByCategoria(String categoria) {
		if (CategoriaProd.isValidCategoria(categoria))
		{
			CategoriaProd categoriaProd = CategoriaProd.valueOf(categoria.toUpperCase());
			List<ProductsCategoriaDTO> dto = new ArrayList<>();
			repository.findByCategoriaProd(categoriaProd).forEach(produto -> dto.add(new ProductsCategoriaDTO(produto.getIdProd(), produto.getNomeProd(), produto.getPrecoProd())));
			return dto;
		}
		else{
			throw new RuntimeException("Categoria inválida");
		}
	}
}