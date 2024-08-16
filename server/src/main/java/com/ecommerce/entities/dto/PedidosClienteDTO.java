package com.ecommerce.entities.dto;

import java.util.List;

public record PedidosClienteDTO(String idPedido, String dataPedido, String horaPedido, double totalPedido,
                                boolean pedidoPago, List<ProductsOrderedDTO> produtos) {
}
