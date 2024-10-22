package com.ecommerce.entities.dto;

public record PagamentosDTO(String idPedido, String cpf, String dataPagamento, String metodoPagamento, double totalPagamento) {
}
