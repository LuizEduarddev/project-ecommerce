package com.ecommerce.entities.dto;

import com.ecommerce.entities.MetodoPagamento;

import java.util.List;

public record addPagamentoDTO(List<String> idPedidos, addPedidoPagamentoDTO pedido, MetodoPagamento metodoPagamento, String token) {
}
