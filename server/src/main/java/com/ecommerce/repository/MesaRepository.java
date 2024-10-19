package com.ecommerce.repository;

import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Users;
import com.ecommerce.entities.dto.MesaBalcaoDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MesaRepository extends JpaRepository<Mesa, String>
{
    Optional<Mesa> findMesaByUsers(Users users);

    Optional<Mesa> findByIdMesaAndEmpresas(String idMesa, Empresas empresas);

    List<MesaBalcaoDTO> findByEmpresas(Empresas empresa);
}
