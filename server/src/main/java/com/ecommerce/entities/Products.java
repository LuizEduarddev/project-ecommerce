package com.ecommerce.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity(name = "products")
@Table(name = "products")
public class Products {

	@Id
	@Column(name = "id_prod")
	@GeneratedValue(strategy = GenerationType.UUID)
	private String idProd;

	@Column(name = "nome_prod")
	private String nomeProd;

	@Column(name = "preco_prod")
	private double precoProd;

	@Column(name = "promo_prod")
	private boolean promoProd;

	@Column(name = "categoria_prod")
	private String categoriaProd;

	@Column(name = "preco_promocao")
	private String precoPromocao;

	@Lob
	@Column(name = "imagem_produto")
	private String imagemProduto;

	public Products() {
	}

	public Products(String nomeProd, double precoProd, boolean promoProd, String categoriaProd, String precoPromocao, String imageData) {
		this.nomeProd = nomeProd;
		this.precoProd = precoProd;
		this.promoProd = promoProd;
		this.categoriaProd = categoriaProd;
		this.precoPromocao = precoPromocao;
		this.imagemProduto = imageData;
	}

	// Getters and setters for all fields

	public String getIdProd() {
		return idProd;
	}

	public void setIdProd(String idProd) {
		this.idProd = idProd;
	}

	public String getNomeProd() {
		return nomeProd;
	}

	public void setNomeProd(String nomeProd) {
		this.nomeProd = nomeProd;
	}

	public double getPrecoProd() {
		return precoProd;
	}

	public void setPrecoProd(double precoProd) {
		this.precoProd = precoProd;
	}

	public boolean isPromoProd() {
		return promoProd;
	}

	public void setPromoProd(boolean promoProd) {
		this.promoProd = promoProd;
	}

	public String getCategoriaProd() {
		return categoriaProd;
	}

	public void setCategoriaProd(String categoriaProd) {
		this.categoriaProd = categoriaProd;
	}

	public String getPrecoPromocao() {
		return precoPromocao;
	}

	public void setPrecoPromocao(String precoPromocao) {
		this.precoPromocao = precoPromocao;
	}

	public String getImagemProduto() {
		return imagemProduto;
	}

	public void setImagemProduto(String imagemProduto) {
		this.imagemProduto = imagemProduto;
	}
}
