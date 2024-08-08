package com.ecommerce.entities;

import jakarta.persistence.*;

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
	private byte[] imagemProduto;

	@Column(name = "visible")
	private boolean visible;

	// Default constructor
	public Products() {
	}

	// Parameterized constructor
	public Products(String nomeProd, double precoProd, boolean promoProd, String categoriaProd,
					String precoPromocao, byte[] imagemProduto, boolean visible) {
		this.nomeProd = nomeProd;
		this.precoProd = precoProd;
		this.promoProd = promoProd;
		this.categoriaProd = categoriaProd;
		this.precoPromocao = precoPromocao;
		this.imagemProduto = imagemProduto;
		this.visible = visible;
	}

	// Getters and Setters
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

	public byte[] getImagemProduto() {
		return imagemProduto;
	}

	public void setImagemProduto(byte[] imagemProduto) {
		this.imagemProduto = imagemProduto;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}
}
