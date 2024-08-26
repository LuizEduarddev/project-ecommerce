package com.ecommerce.entities.dto;

import com.ecommerce.entities.Pedidos;

import java.util.List;

public record MesaDTO(List<PedidosMesaDTO> pedidosMesa, double valorTotal) {
}
