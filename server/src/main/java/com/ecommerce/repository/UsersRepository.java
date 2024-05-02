package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.ecommerce.entities.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, String>{
	 UserDetails findByLoginUser(String login);
}
