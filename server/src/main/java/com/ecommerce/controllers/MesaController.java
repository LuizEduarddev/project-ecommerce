package com.ecommerce.controllers;

import com.ecommerce.entities.Mesa;
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

    @GetMapping("/get-all")
    public List<Mesa> getAll()
    {
        return service.getAllMesa();
    }

    @PostMapping("/get-by-id")
    public ResponseEntity<?> getById(@RequestBody String token)
    {
        return service.getMesaById(token);
    }

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody Mesa mesa)
    {
        return service.addMesa(mesa);
    }

    @PutMapping("/add-cliente/{idMesa}/{idCliente}")
    public ResponseEntity<Optional<Integer>> addCliente(@PathVariable String idMesa, @PathVariable String idCliente)
    {
        Optional<Integer> numeroMesa = service.addClienteMesa(idMesa, idCliente);
        return ResponseEntity.ok(numeroMesa);
    }

    @DeleteMapping("/delete-user/{idMesa}/{idCliente}")
    public ResponseEntity<String> deleteCliente(@PathVariable String idMesa, @PathVariable String idCliente)
    {
        return service.deleteUser(idMesa, idCliente);
    }

    @DeleteMapping("/delete-all-user/{idMesa}")
    public ResponseEntity<String> deleteAll(@PathVariable String idMesa)
    {
        return service.deleteAllUser(idMesa);
    }
}
