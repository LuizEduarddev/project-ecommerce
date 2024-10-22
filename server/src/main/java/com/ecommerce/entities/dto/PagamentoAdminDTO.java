package com.ecommerce.entities.dto;

public record PagamentoAdminDTO(MesaDTO pedido, String idPagamento, String cpfCliente, String dataPagamento, String metodoPagamento) {
}
