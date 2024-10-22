package com.ecommerce.controllers;

import com.ecommerce.entities.UserRole;
import com.ecommerce.entities.Users;
import com.ecommerce.entities.dto.*;
import com.ecommerce.services.MesaService;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.repository.UsersRepository;
import com.ecommerce.services.AuthenticationService;
import com.ecommerce.services.TokenService;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

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

	@Autowired
	@Lazy
	private MesaService mesaService;
	
	@PostMapping("/login")
	public ResponseEntity<AuthLoginDTO> login(@RequestBody AuthDTO data)
	{
		String token = service.loginUser(data);
		return ResponseEntity.ok(new AuthLoginDTO(token, service.getPermission(token)));
	}

	@GetMapping("/autorization")
	public void autorizeSession(@RequestParam String token)
	{
		service.autorizeUserSession(token);
	}

	@GetMapping("/get-roles")
	public List<String> getAuthoritiesAlterData(@RequestParam String token)
	{
		return service.getUserRolesAuthorities(token);
	}

	@GetMapping("/get-by-empresa")
	public List<EmpregadosDTO> getByEmpresa(@RequestParam String token)
	{
		return service.getEmpregadosByEmpresa(token);
	}

	@PostMapping("/search")
	public List<EmpregadosDTO> searchFuncionario(@RequestBody FuncionarioSearchDTO dto)
	{
		return service.searchFuncionario(dto.token(), dto.query());
	}

	@PostMapping("/empresa/get-by-id")
	public EmpregadosDTO getByIdEmpresa(@RequestBody FuncionarioIdDTO dto)
	{
		return service.getUsuarioByIdEmpresa(dto);
	}

	@PostMapping("/get-by-cpf")
	public UserDTO getByCpf(@RequestBody String cpf) {
		return service.getByCpf(cpf);
	}

	@GetMapping("/garcom")
	public void isGarcom() {
	}

	@GetMapping("/balcao_preparo")
	public void isBalcaoPreparo() {
	}
	@GetMapping("/cozinha")
	public void isCozinha() {
	}

	@PostMapping("/get-authorities")
	public Collection<? extends GrantedAuthority> getAuthorities(@RequestParam String token)
	{
		return service.getPermission(token);
	}

	@PostMapping("/alter/avulso")
	public ResponseEntity<String> alterUserAvulso(@RequestBody UserDTO dto)
	{
		return service.alterUserAvulsoData(dto);
	}

	@PostMapping("/funcionario/adicionar")
	public ResponseEntity<String> adicionarFuncionario(@RequestBody CriarFuncionarioDTO dto)
	{
		return service.adicionarNovoFuncionario(dto);
	}

	@PostMapping("/get-by-id")
	public String getById(@RequestBody GetUserDTO dto)
	{
		return service.getById(dto.id(), dto.token());
	}

	@PostMapping("/send-route")
	public Collection<? extends GrantedAuthority>
	routesByPermission(@RequestBody String token)
	{
		return service.getPermission(token);
	}

	@PostMapping("/get-username")
	public String getUsername(@RequestBody String token)
	{
		return service.getUserName(token);
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@ModelAttribute RegisterDTO data)
	{
		return service.registerUser(data);
	}

	@PostMapping("/register/avulso")
	public ResponseEntity<String> registerAvulso(@RequestBody RegisterAvulsoDTO data)
	{
		return service.registerUserAvulso(data);
	}

	@PostMapping("/profile")
	public UserProfileDTO getProfileData(@RequestBody String token)
	{
		return service.getUserData(token);
	}

	@PostMapping("/alter-profile")
	public ResponseEntity<String> alterProfile(@RequestBody UpdateProfileDTO dto)
	{
		return service.alterProfileData(dto);
	}

	@PostMapping("/funcionario/alter-profile")
	public ResponseEntity<String> alterProfileFuncionario(@RequestBody UpdateProfileFuncionarioDTO dto)
	{
		return service.alterProfileFuncionarioData(dto);
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
