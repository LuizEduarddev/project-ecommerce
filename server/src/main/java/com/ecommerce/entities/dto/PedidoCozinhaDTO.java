package com.ecommerce.entities.dto;

import com.ecommerce.entities.PedidoStatus;

import java.util.List;

public record PedidoCozinhaDTO(String idPedido, String horaPedido, String horaPronto, boolean pedidoPronto, List<PedidoCozinhaProdutosDTO> produtos, Integer numeroMesa) {
}
