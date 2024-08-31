package com.ecommerce.entities.dto;

import java.util.List;

public record PedidosMesaDTO(String idPedido, List<ProductsMesaDTO> produtos) {
}
