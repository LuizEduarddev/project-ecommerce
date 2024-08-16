package com.ecommerce.entities.dto;

import com.ecommerce.entities.Pedidos;

import java.util.List;

public record PedidosAdminDTO(List<Pedidos> pedidosList, double total) {
}
