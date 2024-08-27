package com.ecommerce.entities.dto;

import com.mercadopago.resources.payment.Payment;

public record responsePagamentoDTO(Payment responsePagamento, String idPedido) {
}
