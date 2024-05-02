package com.ecommerce.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

	public Products() {
	}

	public Products(String nomeProd, double precoProd) {
		this.nomeProd = nomeProd;
		this.precoProd = precoProd;
	}

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

}
