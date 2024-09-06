package com.ecommerce.entities.dto;

import com.ecommerce.entities.MetodoPagamento;

public record addPagamentoDTO(String idPedido, addPedidoPagamentoDTO pedido, MetodoPagamento metodoPagamento) {
}
