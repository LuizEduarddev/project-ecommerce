package com.ecommerce.controllers;

import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.dto.PedidoAuthorityDTO;
import com.ecommerce.entities.dto.PedidosClienteDTO;
import com.ecommerce.entities.dto.ProductsDTO;
import com.ecommerce.entities.dto.deliveryDTO;
import com.ecommerce.services.PedidosAdminDTO;
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

    @PostMapping("/get-all")
    public List<Pedidos> getAll(@RequestBody String token)
    {
        return service.getAllPedidos(token);
    }

    @PostMapping("/pendencias")
    public List<PedidosClienteDTO> pendentes(@RequestBody String token)
    {
        return service.getPedidosPendentes(token);
    }

    @PostMapping("/get-all-admin")
    public PedidosAdminDTO getAllAdmin(@RequestBody String token)
    {
        return service.getAllPedidosAdmin(token);
    }

    @PostMapping("/get-by-user")
    public List<PedidosClienteDTO> getByUser(@RequestBody String token)
    {
        return service.getPedidoByUser(token);
    }

    @PostMapping("/get-by-id")
    public Pedidos getById(@RequestBody PedidoAuthorityDTO data)
    {
        return service.getPedidoById(data.idPedido(), data.token());
    }

    @PostMapping("/add/{idUser}/{idMesa}")
    public ResponseEntity<String> add(@RequestBody List<String> idProdutos, @PathVariable String idUser, @PathVariable String idMesa)
    {
        return service.addPedido(idProdutos, idUser, idMesa);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addDelivery(@RequestBody deliveryDTO dto)
    {
        return service.addPedidoDelivery(dto.produtos(), dto.token());
    }

    @PostMapping("/set-pr")
    public ResponseEntity<String> setPronto(@RequestBody PedidoAuthorityDTO data)
    {
        return service.setPedidoPronto(data.idPedido(), data.token());
    }

    @PostMapping("/set-pa/{idPedido}")
    public ResponseEntity<String> setPago(@PathVariable String idPedido)
    {
        return service.setPedidoPago(idPedido);
    }
}
