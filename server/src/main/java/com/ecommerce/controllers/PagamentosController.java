package com.ecommerce.controllers;

import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.dto.pagamentoAvulsoDTO;
import com.ecommerce.entities.dto.pagamentoDTO;
import com.ecommerce.services.AuthenticationService;
import com.ecommerce.services.PagamentoService;
import com.ecommerce.entities.Pagamentos;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentosController {

    @Autowired
    private PagamentoService service;

    //E NECESSARIO APAGAR ISTO
    @Autowired
    private AuthenticationService authenticationService;


    @GetMapping("/get-all")
    public List<Pagamentos> getAll(@RequestBody String token)
    {
        return service.getAllPagamentos(token);
    }


    @PostMapping("/pagamento")
    public Object pagamento(@RequestBody pagamentoDTO dto) throws MPException, MPApiException {
        return service.pagamentoPedido(dto);
    }

    @PostMapping("/pagamento/avulso")
    public Object pagamentoAvulso(@RequestBody pagamentoAvulsoDTO dto) throws MPException, MPApiException {
        return service.pagamentoAvulso(dto, authenticationService.getBalcao());
    }

    @PostMapping("/check")
    public ResponseEntity<String> checkPayment(@RequestBody pagamentoDTO dto)
    {
        return service.checkPaymentUser(dto.idPedido(), dto.token());
    }
}
