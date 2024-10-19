package com.ecommerce.services;

import com.ecommerce.entities.*;
import com.ecommerce.entities.dto.*;
import com.ecommerce.repository.PagamentosRepository;
import com.ecommerce.repository.PedidosRepository;
import com.ecommerce.repository.UsersRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.net.HttpStatus;
import com.mercadopago.net.MPResponse;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class PagamentoService {

    @Autowired
    private PagamentosRepository repository;

    @Autowired
    @Lazy
    private PedidosService pedidosService;

    @Autowired
    private MesaService mesaService;

    public List<Pagamentos> getAllPagamentos() {
        return repository.findAll();
    }

    private void checkMesaVazia(Mesa mesa) {
        boolean allPedidosPaid = pedidosService.getAllByMesa(mesa)
                .stream()
                .allMatch(Pedidos::isPedidoPago);

        // If all pedidos are paid, set mesaEmUso to false
        if (allPedidosPaid) {
            mesa.setEmUso(false);
            mesa.setMesaSuja(true);
            mesaService.saveMesa(mesa);
        }
    }


    /*
    public ResponseEntity<String> addPagamento(addPagamentoDTO dto) {
        if (dto.idPedidos() == null && dto.pedido() == null) {
            throw new RuntimeException("Campos necessários não válidados.");
        }

        if (MetodoPagamento.isValidCategoria(dto.metodoPagamento().toString().toUpperCase()))
        {
            List<String> issues = new ArrayList<>();

            try {
                if (dto.idPedidos() == null && dto.pedido().produtos() != null) {
                    Pedidos pedido = pedidosService.addPedidoAvulso(dto.pedido());
                    return generatePagamento(pedido, dto.metodoPagamento());
                } else {
                    List<Pedidos> pedidos = pedidosService.getPedidoById(dto.idPedidos());
                    pedidos.forEach(pedido -> {
                        try {
                            generatePagamento(pedido, dto.metodoPagamento());
                        } catch (Exception e) {
                            issues.add("Falha ao gerar pagamento para o pedido ID: " + pedido.getIdPedido() + ". Erro: " + e.getMessage());
                        }
                    });
                }
            } catch (Exception e) {
                throw new RuntimeException("Falha ao tentar gerar o pagamento\n" + e);
            }

            if (issues.isEmpty()) {
                return ResponseEntity.ok("Pagamentos gerados com sucesso.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erros encontrados:\n" + String.join("\n", issues));
            }
        }
        else{
            throw new RuntimeException("Método de pagamento inválido");
        }

    }

     */

    private ResponseEntity<String> generatePagamento(Pedidos pedido, MetodoPagamento metodoPagamento) {
        try {
            Pagamentos pagamento = new Pagamentos();
            LocalTime currentTime = LocalTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            String formattedTime = currentTime.format(formatter);

            pagamento.setDataPagamento(formattedTime);
            pagamento.setMetodoPagamento(metodoPagamento);
            pagamento.setPedido(pedido);
            pagamento.setCpfUserPagamento(pedido.getCpfClientePedido());
            repository.saveAndFlush(pagamento);
            pedido.setPedidoPago(true);

            if (pedido.getMesa() != null) {
                checkMesaVazia(pedido.getMesa());
            }

            return ResponseEntity.ok("Pagamento efetuado com sucesso.");
        } catch (Exception e) {
            throw new RuntimeException("Falha ao gerar o método de pagamento.\n" + e);
        }
    }


}