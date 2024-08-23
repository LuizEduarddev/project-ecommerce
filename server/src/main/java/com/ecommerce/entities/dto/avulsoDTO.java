package com.ecommerce.entities.dto;

import java.util.List;

public record avulsoDTO(List<ProductsDTO> produtos, String token, String idMesa) {
}
