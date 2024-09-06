package com.ecommerce.entities.dto;

import java.util.List;

public record addPedidoPagamentoDTO(List<ProductsDTO> produtos, String cpfCliente) {
}
