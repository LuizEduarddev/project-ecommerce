package com.ecommerce.entities.dto;

import java.util.List;

public record addPedidoDTO(List<ProductsDTO> produtos, String token, String idMesa) {
}
