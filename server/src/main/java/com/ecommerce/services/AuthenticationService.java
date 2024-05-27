package com.ecommerce.services;

import com.auth0.jwt.impl.ClaimsHolder;
import com.ecommerce.entities.dto.AlterDTO;
import com.ecommerce.infra.security.SecurityFilter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.entities.Users;
import com.ecommerce.entities.dto.AuthDTO;
import com.ecommerce.entities.dto.LoginResponseDTO;
import com.ecommerce.entities.dto.RegisterDTO;
import com.ecommerce.repository.UsersRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {

	@Autowired
	private AuthenticationManager manager;
	
	@Autowired
	private UsersRepository repository;
	
	@Autowired
	private TokenService tokenService;

	@Autowired
	private SecurityFilter securityFilter;
	
	public ResponseEntity<LoginResponseDTO> loginUser(AuthDTO data)
	{
		try
		{
			var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
			var auth = this.manager.authenticate(usernamePassword);
			var token = tokenService.generateToken((Users) auth.getPrincipal());
			return ResponseEntity.ok(new LoginResponseDTO(token));
		}
		catch(Exception e)
		{
			throw new RuntimeException("Usuario ou senha incorretos");
		}
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

	public String getUserName(String token) {

		String getUser = tokenService.validateToken(token);
		if (getUser != null)
		{
			return getUser;
		}
		else{
			throw new RuntimeException("Falha ao tentar recuperar nome de usuário.");
		}
	}

	public Collection<? extends GrantedAuthority> getPermission(String token) {
		Users user = repository.findByLoginUser(getUserName(token));
		if (user == null)
		{
			throw  new RuntimeException("Usuário não encontrado");
		}
		else
		{
			return user.getAuthorities();
		}
	}

	public ResponseEntity<String> getById(String id, String token) {
		Users user = repository.findByLoginUser(getUserName(token));
		if (user != null)
		{
			boolean hasAdmin = user.getAuthorities().stream()
					.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
			if(hasAdmin)
			{
				return ResponseEntity.ok(user.getUserFullName());
			}
			else{
				throw new RuntimeException("É necessária uma hierárquia maior.");
			}
		}
		else{
			throw new RuntimeException("Ocorreu um erro ao tentar buscar o usuário.");
		}
	}
}
