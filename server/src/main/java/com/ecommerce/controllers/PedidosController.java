package com.ecommerce.controllers;

import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.dto.*;
import com.ecommerce.entities.dto.PedidosAdminDTO;
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
        return service.getPedidoById(data.idPedido());
    }

    @PostMapping("/get-by-mesa")
    public MesaDTO getByMesa(@RequestBody GetPedidoDTO dto)
    {
        return service.getPedidoByMesaDTO(dto);
    }

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody addPedidoDTO dto)
    {
        return service.addPedido(dto);
    }

}
