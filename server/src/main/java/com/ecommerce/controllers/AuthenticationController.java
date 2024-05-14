package com.ecommerce.controllers;

import com.ecommerce.entities.Users;
import com.ecommerce.entities.dto.AlterDTO;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entities.dto.AuthDTO;
import com.ecommerce.entities.dto.LoginResponseDTO;
import com.ecommerce.entities.dto.RegisterDTO;
import com.ecommerce.repository.UsersRepository;
import com.ecommerce.services.AuthenticationService;
import com.ecommerce.services.TokenService;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager manager;
	
	@Autowired
	private UsersRepository repository;
	
	@Autowired
	private TokenService tokenService;
	
	@Autowired
	private AuthenticationService service;
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthDTO data)
	{
		return service.loginUser(data);
	}

	@PostMapping("/send-route")
	public Collection<? extends GrantedAuthority> routesByPermission(@RequestBody String token)
	{
		return service.getPermission(token);
	}

	@PostMapping("/get-username")
	public String getUsername(@RequestBody String token)
	{
		return service.getUserName(token);
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody RegisterDTO data)
	{
		return service.registerUser(data);
	}

	@GetMapping("/get-all")
	public List<Users> getAll()
	{
		return service.getAllUsers();
	}
	/*
	@PutMapping("/alter/{id}")
	public ResponseEntity<String> alter(@RequestBody AlterDTO data, @PathVariable String id)
	{
		return service.alter(data, id);
	}
	*/
}
