package com.ecommerce.entities.dto;

import java.math.BigDecimal;

public record pagamentoDTO (String idPedido, BigDecimal totalPedido, String userEmail, String userFullName, String cpf ){

}