package com.ecommerce.entities.dto;

import java.util.List;

public record PedidosProntoGarcomDTO(String idPedido, List<ProdutoQuantidadeDTO> produtoDTO, int numeroMesa) {
}
