package com.ecommerce.entities.dto;

import java.util.List;

public record pagamentoAvulsoDTO(List<ProductsDTO> produtos, String token) {
}
