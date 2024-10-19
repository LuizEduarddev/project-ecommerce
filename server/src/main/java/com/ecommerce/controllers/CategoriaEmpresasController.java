package com.ecommerce.controllers;

import com.ecommerce.entities.CategoriasEmpresas;
import com.ecommerce.entities.dto.AddCategoriaEmpresaDTO;
import com.ecommerce.services.CategoriaEmpresasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas/categorias")
public class CategoriaEmpresasController {

    @Autowired
    private CategoriaEmpresasService service;

    @GetMapping("/get-all")
    public List<CategoriasEmpresas> getAll()
    {
        return service.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity add(@RequestBody AddCategoriaEmpresaDTO dto)
    {
        return service.addCategoria(dto);
    }

    @GetMapping("/get-by-empresa")
    public List<String> getByEmpresa(@RequestParam String token)
    {
        return service.getCategoriaByEmpresa(token);
    }

}
