package com.ecommerce.repository;

import com.ecommerce.entities.CategoriasEmpresas;
import com.ecommerce.entities.Empresas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriasEmpresasRepository extends JpaRepository<CategoriasEmpresas, String> {
    List<CategoriasEmpresas> findByEmpresa(Empresas empresa);
    CategoriasEmpresas findByEmpresaAndNomeCategoriaEmpresa(Empresas empresa, String nomeCategoriaEmpresa);
}
