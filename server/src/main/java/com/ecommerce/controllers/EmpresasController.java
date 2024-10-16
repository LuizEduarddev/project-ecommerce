package com.ecommerce.controllers;

import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.dto.CriaEmpresaDTO;
import com.ecommerce.services.EmpresasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresasController {

    @Autowired
    private EmpresasService service;

    @GetMapping("/get-all")
    public List<Empresas> getAll()
    {
        return service.getAllEmpresas();
    }

    @PostMapping("/add")
    public ResponseEntity add(@RequestBody CriaEmpresaDTO empresa)
    {
        return service.addEmpresa(empresa);
    }
}
