package com.ecommerce.controllers;

import com.ecommerce.entities.Pedidos;
import com.ecommerce.entities.dto.*;
import com.ecommerce.entities.dto.PedidosAdminDTO;
import com.ecommerce.services.PedidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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

    @PostMapping("/pendencias")
    public List<PedidosClienteDTO> pendentes(@RequestBody String token)
    {
        return service.getPedidosPendentes(token);
    }

    @PostMapping("/pronto/garcom")
    public List<PedidosProntoGarcomDTO> pedidoProntoGarcom(String token)
    {
        return service.pedidoProntoGarcom(token);
    }

    /*
    @PostMapping("/pronto")
    public ResponseEntity<String> pedidoPronto(@RequestBody SetPedidoProntoDTO dto)
    {
        return service.setPedidoPronto(dto.idPedido(), dto.token());
    }

     */

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
    public List<Pedidos> getById(@RequestBody PedidoAuthorityDTO data)
    {
        List<String> list = new ArrayList<>();
        list.add(data.idPedido());
        return service.getPedidoByListIdAndEmpresa(list, data.token());
    }

    @PostMapping("/get-by-mesa")
    public MesaDTO getByMesa(@RequestBody GetPedidoDTO dto)
    {
        return service.getPedidoByMesaDTO(dto);
    }

    /*
    @PostMapping("/get-for-cozinha")
    public List<PedidoCozinhaDTO> getForCozinha(String token)
    {
        return service.getPedidoForCozinha(token);
    }

    @PostMapping("/get-for-balcao-preparo")
    public List<PedidoCozinhaDTO> getForBalcaoPreparo(String token)
    {
        return service.getPedidoForBalcaoPreparo(token);
    }

     */

    @PostMapping("/get-by-cpf")
    public MesaDTO getByCpf(@RequestBody GetByCpfDTO dto)
    {
        return service.getPedidoByCpf(dto);
    }

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody addPedidoDTO dto)
    {
        return service.addPedido(dto);
    }

}
