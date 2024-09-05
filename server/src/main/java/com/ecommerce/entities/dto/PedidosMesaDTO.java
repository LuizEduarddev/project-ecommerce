package com.ecommerce.entities.dto;

import com.ecommerce.entities.PedidoStatus;

import java.util.List;

public record PedidosMesaDTO(String idPedido, boolean pedidoPronto, List<ProductsMesaDTO> produtos) {
}
