package com.ecommerce.repository;

import com.ecommerce.entities.Mesa;
import com.ecommerce.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MesaRepository extends JpaRepository<Mesa, String>
{
}
