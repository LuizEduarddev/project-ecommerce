package com.ecommerce.repository;

import com.ecommerce.entities.Empresas;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresasRepository extends JpaRepository<Empresas, String>
{
}
