package com.ecommerce.controllers;

import com.ecommerce.services.PagamentoService;
import com.ecommerce.entities.Pagamentos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentosController {

    @Autowired
    private PagamentoService service;

    @GetMapping("/get-all")
    public List<Pagamentos> getAll(@RequestBody String token)
    {
        return service.getAllPagamentos(token);
    }

    @PostMapping("/check")
    public ResponseEntity<String> checkPayment(@RequestBody String token, String idPedido)
}
