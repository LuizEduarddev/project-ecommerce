package com.ecommerce.services;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import com.ecommerce.entities.dto.CreateProductDTO;
import com.ecommerce.entities.dto.ProductsBased64DTO;
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
		try {
			MultipartFile file = novoProduto.getFile();
			byte[] imageData = file.getBytes();
			String base64Image = Base64.getEncoder().encodeToString(imageData);
			Products product = new Products(novoProduto.getNomeProd(), novoProduto.getPrecoProd(),
					novoProduto.isPromoProd(), novoProduto.getCategoriaProd(),
					novoProduto.getPrecoPromocao(), base64Image);
			repository.saveAndFlush(product);
			return new ResponseEntity<>("Produto cadastrado com sucesso.", HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>("Falha ao tentar cadastrar o produto.\nERROR: " + e, HttpStatus.BAD_REQUEST);
		}
	}
	
	public ResponseEntity<String> alterProduct(String id, Products alterProduto) throws Exception
	{
		Products produto = repository.findById(id)
				.orElseThrow(() -> new Exception("Produto com id '" + id + "' nao encontrado."));
				
		try {
	        Class<?> produtoClass = Products.class;
	        Field[] fields = produtoClass.getDeclaredFields();

	        for (Field field : fields) {   		
        		field.setAccessible(true);
        		Object value = field.get(alterProduto);
        		if (value != null) {
        			field.set(produto, value);	
	        	}
	        }

	        repository.saveAndFlush(produto);
	        return new ResponseEntity<>("Produto '" + alterProduto.getNomeProd() + "' alterado com sucesso!", HttpStatus.ACCEPTED);
	        
	    } catch (IllegalAccessException e) {
	        throw new Exception("Erro ao atualizar mesa." + e);
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
}