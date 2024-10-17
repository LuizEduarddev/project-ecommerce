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

    @GetMapping("/get")
    public List<MesaBalcaoDTO> getByEmpresa(@RequestParam String token)
    {
        return service.getMesaByEmpresa(token);
    }

    @GetMapping("/get-all")
    public List<MesaBalcaoDTO> getAll()
    {
        return service.getAllMesa();
    }

    /*
    @PostMapping("/get-by-id")
    public MesaDTO getById(@RequestBody deleteMesaDTO dto)
    {
        return service.getMesaById(dto.idMesa(), dto.token());
    }

     */

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody addMesaDTO dto)
    {
        return service.addMesa(dto.numeroMesa(), dto.token());
    }
}
