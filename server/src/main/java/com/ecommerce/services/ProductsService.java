package com.ecommerce.services;

import java.util.*;
import java.util.stream.Collectors;

import com.ecommerce.entities.CategoriasEmpresas;
import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.dto.*;
import com.ecommerce.entities.errors.ProductsException;
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

	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private CategoriaEmpresasService categoriaEmpresasService;
	
	public List<Products> getAllProducts()
	{
		return repository.findAll();
	}
	
	public Products getProductById(String id) throws Exception
	{
		return repository.findById(id)
				.orElseThrow(() -> new ProductsException("Produto com id '" + id + "' nao encontrado"));
	}

	public ResponseEntity<String> addProduct(CreateProductDTO novoProduto) {
		Empresas empresa = authenticationService.getEmpresaByToken(novoProduto.getToken());
		if (empresa != null)
		{
			CategoriasEmpresas categoriasEmpresas = categoriaEmpresasService.isValidCategoria(novoProduto.getCategoriaProd(), empresa);
			if (categoriasEmpresas != null)
			{
				if (novoProduto.isPromoProd() && (novoProduto.getPrecoProd() <= novoProduto.getPrecoPromocao() || novoProduto.getPrecoPromocao() == 0))
				{
					throw new ProductsException("Promoção inválida");
				}
				if (novoProduto.getFile() != null && !novoProduto.getFile().isEmpty())
				{
					try {
						MultipartFile file = novoProduto.getFile();
						byte[] imageData = file.getBytes();
						Products product = new Products(
								novoProduto.getNomeProd().toUpperCase(),
								novoProduto.getPrecoProd(),
								novoProduto.isPromoProd(),
								categoriasEmpresas,
								novoProduto.getPrecoPromocao(),
								imageData,
								novoProduto.isVisible(),
								empresa
						);
						repository.saveAndFlush(product);
						return new ResponseEntity<>("Produto cadastrado com sucesso.", HttpStatus.CREATED);
					} catch (Exception e) {
						return new ResponseEntity<>("Falha ao tentar cadastrar o produto." + "\nError: " + e, HttpStatus.FAILED_DEPENDENCY);
					}
				}
				else{
					return addProductWithoutFoto(novoProduto, categoriasEmpresas, empresa);
				}
			}
			else{
				throw new ProductsException("É necessário uma categoria válida");
			}
		}
        else{
			throw new ProductsException("Empresa inválida.");
		}
    }

	private ResponseEntity<String> addProductWithoutFoto(CreateProductDTO novoProduto, CategoriasEmpresas categoriasEmpresas, Empresas empresa) {
		try {
			Products product = new Products(
					novoProduto.getNomeProd(),
					novoProduto.getPrecoProd(),
					novoProduto.isPromoProd(),
					categoriasEmpresas,
					novoProduto.getPrecoPromocao(),
					novoProduto.isVisible(),
					empresa
			);
			repository.saveAndFlush(product);
			return new ResponseEntity<>("Produto cadastrado com sucesso.", HttpStatus.CREATED);
		} catch (Exception e) {
			throw new ProductsException("Falha ao tentar cadastrar o produto." + "\nError: " + e);
		}
	}

	public ResponseEntity<String> alterProduct(EditarProductDTO dto) throws Exception {
		Empresas empresa = authenticationService.getEmpresaByToken(dto.getToken());
		if (empresa != null)
		{
			CategoriasEmpresas categoriasEmpresas = categoriaEmpresasService.isValidCategoria(dto.getToken(), empresa);
			if (categoriasEmpresas != null)
			{
				Products produto = repository.findById(dto.getIdProduto())
						.orElseThrow(() -> new ProductsException("Produto não encontrado."));
				if (dto.isPromoProd() && (dto.getPrecoProd() <= dto.getPrecoPromocao() || dto.getPrecoPromocao() == 0))
				{
					throw new ProductsException("Promoção inválida.");
				}
				if (dto.getFile() == null)
				{
					produto.setNomeProd(dto.getNomeProd());
					produto.setPrecoProd(dto.getPrecoProd());
					produto.setPromoProd(dto.isPromoProd());
					produto.setCategoriaProd(categoriasEmpresas);
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
						produto.setCategoriaProd(categoriasEmpresas);
						produto.setPrecoPromocao(dto.getPrecoPromocao());
						produto.setImagemProduto(imageData);
						produto.setVisible(dto.isVisible());
						repository.saveAndFlush(produto);
						return new ResponseEntity<>("Produto alterado com sucesso.", HttpStatus.CREATED);
					}
					catch(Exception e)
					{
						throw new ProductsException("Falha ao tentar alterar o produto.");
					}
				}
			}
			else{
				throw new ProductsException("Categoria inválida.");
			}
		}
		else{
			throw new ProductsException("Erro na autenticação.");
		}
	}
	
	public ResponseEntity<String> deleteProduto(String id) throws Exception
	{
		Products produto = repository.findById(id)
				.orElseThrow(() -> new ProductsException("Falha ao deletar o produto.\nProduto com id nao encontrado"));
		String nomeProduto = produto.getNomeProd();
		
		repository.deleteById(id);
		return new ResponseEntity<>("Produto '" + nomeProduto + "' deletado com sucesso.", HttpStatus.ACCEPTED);
	}

    public List<Products> getProductsPromotion(String token) {
		Empresas empresa = authenticationService.getEmpresaByToken(token);
		if (empresa != null)
		{
			try
			{
				return repository.findByEmpresaAndPromoProdTrue(empresa);
			}
			catch (Exception e)
			{
				throw new ProductsException("Falha ao tentar buscar os produtos em promoção.");
			}
		}
		else{
			throw new ProductsException("Falha ao autenticar.");
		}
    }

	@Transactional
	public List<Products> searchProduct(PesquisaProdutoDTO dto) {
		Empresas empresa = authenticationService.getEmpresaByToken(dto.token());
		if  (empresa != null)
		{
			try
			{
				List<Products> produtosList = repository.findByEmpresaAndNomeProdContaining(empresa, dto.pesquisa().toUpperCase());
				List<Products> produtosReturn = new ArrayList<>();

				for (Products produto : produtosList) {
					if (produto.isVisible()) {
						if (produto.isPromoProd()) {
							produto.setPrecoProd(produto.getPrecoPromocao());
						}
						produtosReturn.add(produto);
					}
				}
				return produtosReturn.isEmpty() ? null : produtosReturn;
			}
			catch (Exception e)
			{
				throw new ProductsException("Falha ao tentar buscar o produto.");
			}
		}
		else{
			throw new ProductsException("Falha na autenticação.");
		}

	}

	@Transactional
	public List<Products> searchProductBalcao(PesquisaProdutoDTO dto) {
		Empresas empresa = authenticationService.getEmpresaByToken(dto.token());
		if (empresa != null)
		{
			try
			{
				List<Products> produtosList = repository.findByEmpresaAndNomeProdContaining(empresa, dto.pesquisa().toUpperCase());
				if (!produtosList.isEmpty())
				{
					return produtosList;
				}
				else{
					return null;
				}
			}
			catch (Exception e)
			{
				throw new ProductsException("Falha ao tentar buscar o produto");
			}
		}
		else{
			throw new ProductsException("Falha ao tentar buscar o produto.");
		}
	}

	@Transactional
	public List<ProductsCategoriaDTO> getProductByCategoria(CategoriariaProdutoDTO dto) {
		Empresas empresa = authenticationService.getEmpresaByToken(dto.token());
		if (empresa != null)
		{
			try
			{
				CategoriasEmpresas categoriasEmpresas = categoriaEmpresasService.isValidCategoria(dto.categoria(), empresa);
				if (categoriasEmpresas != null)
				{
					List<ProductsCategoriaDTO> dtoProdutos = new ArrayList<>();
					repository.findByCategoriaProd(categoriasEmpresas).forEach(produto -> dtoProdutos
							.add(new ProductsCategoriaDTO(produto.getIdProd(), produto.getNomeProd(), produto.getPrecoProd())));
					return dtoProdutos;
				}
				else{
					throw new ProductsException("Categoria inválida");
				}
			}
			catch (Exception e)
			{
				throw new ProductsException("Falha ao tentar buscar o produto pela categoria.");
			}
		}
		else{
			throw new RuntimeException("Falha na autenticação.");
		}
	}

	@Transactional
	public List<ProductsEmpresaDTO> getProductByEmpresa(String token) {
		Empresas empresa = authenticationService.getEmpresaByToken(token);
		if (empresa != null) {
			try {

				List<Products> productsList = repository.findByEmpresa(empresa);
 				return productsList.stream().map(product -> new ProductsEmpresaDTO(
						product.getIdProd(),
						product.getNomeProd(),
						product.getPrecoProd(),
						product.isPromoProd(),
						product.getCategoriaProd().getNomeCategoriaEmpresa(),
						product.getPrecoPromocao(),
						product.getImagemProduto(),
						product.isVisible()
				)).collect(Collectors.toList());
			} catch (Exception e) {
				throw new ProductsException("Falha ao tentar buscar o produto.");
			}
		} else {
			throw new ProductsException("Falha ao tentar autenticar.");
		}
	}
}