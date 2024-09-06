package com.ecommerce.controllers;

import com.ecommerce.entities.MetodoPagamento;
import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.dto.addPagamentoDTO;
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

    @GetMapping("/get-all")
    public List<Pagamentos> getAll()
    {
        return service.getAllPagamentos();
    }

    @GetMapping("/get-metodos")
    public List<String> getMetodosPagamento()
    {
        return MetodoPagamento.allCategorias();
    }

    @PostMapping("/add")
    public Object add(@RequestBody(required = false) addPagamentoDTO dto){
        return service.addPagamento(dto);
    }
}
