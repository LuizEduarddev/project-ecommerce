package com.ecommerce.services;

import com.ecommerce.entities.dto.*;
import com.ecommerce.infra.security.SecurityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.entities.Users;
import com.ecommerce.repository.UsersRepository;

import java.util.Collection;
import java.util.List;

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

	@Autowired
	@Lazy
	private PedidosService pedidosService;
	
	public String loginUser(AuthDTO data)
	{
		try
		{
			var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
			var auth = this.manager.authenticate(usernamePassword);
            return tokenService.generateToken((Users) auth.getPrincipal());
		}
		catch(Exception e) {
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

	public String getById(String id, String token) {
		Users user = repository.findByLoginUser(getUserName(token));
		if (user != null)
		{
			boolean hasAdmin = user.getAuthorities().stream()
					.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
			if(hasAdmin)
			{
				Users nomeCliente = repository.findById(id)
						.orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
				return nomeCliente.getUsername();
			}
			else{
				throw new RuntimeException("É necessária uma hierárquia maior.");
			}
		}
		else{
			throw new RuntimeException("Ocorreu um erro ao tentar buscar o usuário.");
		}
	}

	public UserProfileDTO getUserData(String token) {
		Users user = repository.findByLoginUser(getUserName(token));
		if (user != null)
		{
            return new UserProfileDTO(user.getUsername(),user.getUserFullName(), user.getUserTelefone(), user.getUserCpf(), user.getUserEndereco(), user.getUserEmail());
		}
		else{
			throw new RuntimeException("Ocorreu um erro ao tentar buscar as informações do usuário.");
		}
	}

	public ResponseEntity<String> alterProfileData(UpdateProfileDTO updateProfileDTO) {
		try
		{
			Users user = repository.findByLoginUser(getUserName(updateProfileDTO.getToken()));
			if (user == null)
			{
				throw new RuntimeException("Usuário não encontrado");
			}
			if (updateProfileDTO.getCpf() != null)
			{
				user.setUserCpf(updateProfileDTO.getCpf());
			}
			if (updateProfileDTO.getEmail() != null)
			{
				user.setUserEmail(updateProfileDTO.getEmail());
			}
			if (updateProfileDTO.getEndereco() != null)
			{
				user.setUserEndereco(updateProfileDTO.getEndereco());
			}
			if (updateProfileDTO.getNomeCompleto() != null)
			{
				user.setUserFullName(updateProfileDTO.getNomeCompleto());
			}
			if (updateProfileDTO.getTelefone() != null)
			{
				user.setUserTelefone(updateProfileDTO.getTelefone());
			}

			repository.saveAndFlush(user);
			return ResponseEntity.ok("Usuário alterado com sucesso.");
		}
		catch (Exception e)
		{
			throw new RuntimeException("Erro encontrado: " + e);
		}
	}
}
