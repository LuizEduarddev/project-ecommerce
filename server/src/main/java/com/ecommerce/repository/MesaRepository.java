package com.ecommerce.repository;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MesaRepository extends JpaRepository<Mesa, String>
{
    Optional<Mesa> findMesaByUsers(Users users);
}
