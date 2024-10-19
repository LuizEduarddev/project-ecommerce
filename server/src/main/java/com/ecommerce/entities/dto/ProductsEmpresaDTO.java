package com.ecommerce.entities.dto;

import com.ecommerce.entities.CategoriasEmpresas;

public record ProductsEmpresaDTO(String idProduto, String nomeProd, double precoProd, boolean promoProd, String categoria, double precoPromocao, byte[] imagemProduto, boolean visible) {
}
