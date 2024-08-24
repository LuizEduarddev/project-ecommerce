package com.ecommerce.controllers;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.dto.*;
import com.ecommerce.services.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mesa")
public class MesaController {

    @Autowired
    private MesaService service;

    @PostMapping("/get-all")
    public List<MesaBalcaoDTO> getAll(@RequestBody String token)
    {
        return service.getAllMesa(token);
    }

    @PostMapping("/get-by-id")
    public MesaDTO getById(@RequestBody deleteMesaDTO dto)
    {
        return service.getMesaById(dto.idMesa(), dto.token());
    }

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody addMesaDTO dto)
    {
        return service.addMesa(dto.numeroMesa(), dto.token());
    }

    @PutMapping("/add/cliente")
    public ResponseEntity<String> addCliente(@RequestBody addClienteDTO dto)
    {
        return service.addClienteMesa(dto.idMesa(), dto.token());
    }

    @DeleteMapping("/cliente/delete")
    public ResponseEntity<String> deleteCliente(@RequestBody deleteMesaDTO dto)
    {
        return service.deleteUser(dto.idMesa(), dto.token());
    }

    @DeleteMapping("/delete-all-user/{idMesa}")
    public ResponseEntity<String> deleteAll(@PathVariable String idMesa)
    {
        return service.deleteAllUser(idMesa);
    }
}
