package com.ecommerce.entities.dto;

import com.ecommerce.entities.Products;
import com.ecommerce.entities.Users;

import java.util.List;

public record PedidoAvulsoDTO(List<ProductsDTO> produtos, Users user) {
}
