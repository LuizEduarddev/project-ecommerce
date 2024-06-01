package com.ecommerce.entities.dto;

import com.ecommerce.entities.Pedidos;

import java.util.List;

public record MesaDTO(int numeroMesa, List<String> nomeClientes, List<Pedidos> pedidosAnteriores) {
}
