package com.ecommerce.entities;

import jakarta.persistence.*;

@Entity(name = "products")
@Table(name = "products")
public class Products {

	@Id
	@Column(name = "id_prod")
	@GeneratedValue(strategy = GenerationType.UUID)
	private String idProd;

	@Column(name = "nome_prod", unique = true)
	private String nomeProd;

	@Column(name = "preco_prod")
	private double precoProd;

	@Column(name = "promo_prod")
	private boolean promoProd;

	@OneToOne
	private CategoriasEmpresas categoriaProd;

	@Column(name = "preco_promocao")
	private double precoPromocao;

	@Lob
	@Column(name = "imagem_produto")
	private byte[] imagemProduto;

	@Column(name = "visible")
	private boolean visible;

	@ManyToOne
	@JoinColumn(nullable = false)
	private Empresas empresa;

	// Default constructor
	public Products() {
	}

	public Products(String nomeProd, double precoProd, boolean promoProd, CategoriasEmpresas categoriaProd,double precoPromocao, byte[] imagemProduto, boolean visible) {
		this.nomeProd = nomeProd;
		this.precoProd = precoProd;
		this.promoProd = promoProd;
		this.categoriaProd = categoriaProd;
		this.precoPromocao = precoPromocao;
		this.imagemProduto = imagemProduto;
		this.visible = visible;
	}

	public Products(String nomeProd, double precoProd, boolean promoProd, CategoriasEmpresas categoriaProd, double precoPromocao, boolean visible) {
		this.nomeProd = nomeProd;
		this.precoProd = precoProd;
		this.promoProd = promoProd;
		this.categoriaProd = categoriaProd;
		this.precoPromocao = precoPromocao;
		this.visible = visible;
	}

	public Products(String nomeProd, double precoProd, boolean promoProd, CategoriasEmpresas categoriaProd, double precoPromocao, byte[] imagemProduto, boolean visible, Empresas empresa) {
		this.nomeProd = nomeProd;
		this.precoProd = precoProd;
		this.promoProd = promoProd;
		this.categoriaProd = categoriaProd;
		this.precoPromocao = precoPromocao;
		this.imagemProduto = imagemProduto;
		this.visible = visible;
		this.empresa = empresa;
	}

	public CategoriasEmpresas getCategoriaProd() {
		return categoriaProd;
	}

	public void setCategoriaProd(CategoriasEmpresas categoriaProd) {
		this.categoriaProd = categoriaProd;
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

	public double getPrecoPromocao() {
		return precoPromocao;
	}

	public void setPrecoPromocao(double precoPromocao) {
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

	public Empresas getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresas empresa) {
		this.empresa = empresa;
	}
}
