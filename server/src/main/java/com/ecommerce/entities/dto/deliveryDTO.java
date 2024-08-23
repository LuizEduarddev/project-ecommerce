package com.ecommerce.entities.dto;

import java.util.List;

public record deliveryDTO(List<ProductsDTO> produtos, String token, String idMesa) {
}
