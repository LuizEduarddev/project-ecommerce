package com.ecommerce.services;

import com.ecommerce.entities.dto.AlterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.entities.Users;
import com.ecommerce.entities.dto.AuthDTO;
import com.ecommerce.entities.dto.LoginResponseDTO;
import com.ecommerce.entities.dto.RegisterDTO;
import com.ecommerce.repository.UsersRepository;

import java.util.List;

@Service
public class AuthenticationService {

	@Autowired
	private AuthenticationManager manager;
	
	@Autowired
	private UsersRepository repository;
	
	@Autowired
	private TokenService tokenService;
	
	public ResponseEntity<LoginResponseDTO> loginUser(AuthDTO data)
	{
		var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
		var auth = this.manager.authenticate(usernamePassword);
		var token = tokenService.generateToken((Users) auth.getPrincipal());
		
		return ResponseEntity.ok(new LoginResponseDTO(token));
	}
	
	public ResponseEntity<String> registerUser(RegisterDTO data)
	{
		if (this.repository.findByLoginUser(data.login()) != null) return new ResponseEntity<String>("Usuário já existente.", HttpStatus.BAD_REQUEST);
		
		String encryptPassword = new BCryptPasswordEncoder().encode(data.password());
		Users newUser = new Users(data.login(), encryptPassword, data.role());
		this.repository.saveAndFlush(newUser);
		
		return new ResponseEntity<String>("Usuário criado com sucesso.", HttpStatus.CREATED);
	}

    public List<Users> getAllUsers()
	{
    	return repository.findAll();
	}

	/*
    public ResponseEntity<String> alter(AlterDTO data, String id) {
		Users user = repository.findById(id)
				.orElseThrow(() -> new RuntimeException("Usuario nao encontrado no sistema"));

		repository.saveAndFlush()
	}
	*/

}
