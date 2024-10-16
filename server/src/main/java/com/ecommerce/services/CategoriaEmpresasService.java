package com.ecommerce.services;

import com.ecommerce.entities.CategoriasEmpresas;
import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.dto.AddCategoriaEmpresaDTO;
import com.ecommerce.entities.errors.CategoriaEmpresasException;
import com.ecommerce.repository.CategoriasEmpresasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.xml.catalog.CatalogException;
import java.util.List;

@Service
public class CategoriaEmpresasService {

    @Autowired
    private CategoriasEmpresasRepository repository;

    @Autowired
    private AuthenticationService authenticationService;

    public List<CategoriasEmpresas> getAll()
    {
        return repository.findAll();
    }

    public ResponseEntity addCategoria(AddCategoriaEmpresaDTO dto)
    {
        Empresas empresa = authenticationService.getEmpresaByToken(dto.token());
        if (empresa != null)
        {
            try
            {
                CategoriasEmpresas categoriasEmpresas = new CategoriasEmpresas();
                categoriasEmpresas.setEmpresa(empresa);
                categoriasEmpresas.setNomeCategoriaEmpresa(dto.categoria().toUpperCase());
                repository.saveAndFlush(categoriasEmpresas);
                return ResponseEntity.ok("Categoria criada com sucesso.");
            }
            catch (Exception e)
            {
                throw new CategoriaEmpresasException("Falha ao tentar criar uma nova categoria");
            }
        }
        else{
            throw new CategoriaEmpresasException("Falha ao criar a categoria");
        }
    }

    public List<CategoriasEmpresas> getCategoriaByEmpresa(String token)
    {
        Empresas empresa = authenticationService.getEmpresaByToken(token);
        if (empresa != null)
        {
            try
            {
                return repository.findByEmpresa(empresa);
            }
            catch (Exception e)
            {
                throw new CategoriaEmpresasException("Falha ao buscar as categorias pela empresa.");
            }
        }
        else{
            throw new CategoriaEmpresasException("Falha ao buscar as categorias pela empresa.");
        }
    }

    public CategoriasEmpresas isValidCategoria(String categoria, Empresas empresa)
    {
        try
        {
            CategoriasEmpresas categoriasEmpresas = repository.findByEmpresaAndNomeCategoriaEmpresa(empresa, categoria);
            if (categoriasEmpresas != null)
            {
                return categoriasEmpresas;
            }
            else{
                return null;
            }
        }
        catch (Exception e)
        {
            throw new CategoriaEmpresasException("Falha ao tentar validar a categoria");
        }
    }
}
