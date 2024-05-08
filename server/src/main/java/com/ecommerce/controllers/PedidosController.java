package com.ecommerce.controllers;

import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.Products;
import com.ecommerce.services.PedidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidosController {

    @Autowired
    private PedidosService service;

    @GetMapping("/get-all")
    public List<Pedidos> getAll()
    {
        return service.getAllPedidos();
    }

    @PostMapping("/get-by-id/{idPedido}")
    public Pedidos getById(@PathVariable String idPedido)
    {
        return service.getPedidoById(idPedido);
    }

    @PostMapping("/add/{idUser}/{idMesa}")
    public ResponseEntity<String> add(@RequestBody List<String> idProdutos, @PathVariable String idUser, @PathVariable String idMesa)
    {
        return service.addPedido(idProdutos, idUser, idMesa);
    }

    @PostMapping("/add/{tokenUser}")
    public ResponseEntity<String> addDelivery(@RequestBody List<Products> products, @PathVariable String tokenUser)
    {
        return service.addPedidoDelivery(products, tokenUser);
    }

    @PostMapping("/set-pr/{idPedido}")
    public ResponseEntity<String> setPronto(@PathVariable String idPedido)
    {
        return service.setPedidoPronto(idPedido);
    }

    @PostMapping("/set-pa/{idPedido}")
    public ResponseEntity<String> setPago(@PathVariable String idPedido)
    {
        return service.setPedidoPago(idPedido);
    }
}
