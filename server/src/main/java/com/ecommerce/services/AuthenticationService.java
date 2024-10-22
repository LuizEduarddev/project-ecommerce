package com.ecommerce.services;

import com.ecommerce.entities.Empresas;
import com.ecommerce.entities.UserRole;
import com.ecommerce.entities.dto.*;
import com.ecommerce.entities.errors.AuthenticationException;
import com.ecommerce.entities.errors.EmpresasException;
import com.ecommerce.infra.security.SecurityFilter;
import jakarta.transaction.Transactional;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
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

	@Transactional
	public String loginUser(AuthDTO data)
	{
		try
		{
			var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
			var auth = this.manager.authenticate(usernamePassword);
            return tokenService.generateToken((Users) auth.getPrincipal());
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Transactional
	public Users getUser(String token)
	{
		Users user = repository.findByLoginUser(getUserName(token));
		if (user != null) {
			return user;
		}
		else{
			return null;
		}
	}

	public Users getUserById(String idUser)
	{
		return repository.findById(idUser)
				.orElseThrow();
	}

	public Empresas getEmpresaByToken(String token)
	{
		try
		{
			Users user = repository.findByLoginUser(getUserName(token));
			if (user != null)
			{
				return user.getEmpresa();
			}
			else{
				throw new EmpresasException("Empresa não encontrada no sistema.");
			}
		}
		catch(Exception e)
		{
			throw new EmpresasException("Erro ao tentar buscar a empresa." + e);
		}
	}

	@Transactional
	public Users getBalcao()
	{
		return repository.findByLoginUser("balcao");
	}

	public ResponseEntity<String> registerUser(RegisterDTO data)
	{
		if (this.repository.findByLoginUser(data.login()) != null) return new ResponseEntity<String>("Usuário já existente.", HttpStatus.BAD_REQUEST);
		if (data.file().isPresent())
		{
			addUserFoto(data);
			return new ResponseEntity<String>("Usuário criado com sucesso.", HttpStatus.CREATED);
		}
		else{
			String encryptPassword = new BCryptPasswordEncoder().encode(data.password());
			Users newUser = new Users(data.login(), encryptPassword, data.role());
			newUser.setPontosCupcake(0);
			this.repository.saveAndFlush(newUser);
			return new ResponseEntity<String>("Usuário criado com sucesso.", HttpStatus.CREATED);
		}
    }

	private void addUserFoto(RegisterDTO data)
	{
		try
		{
			MultipartFile file = data.file().get();
			byte[] imageData = file.getBytes();
			String encryptPassword = new BCryptPasswordEncoder().encode(data.password());
			Users newUser = new Users(data.login(), encryptPassword, data.role(), imageData);
			newUser.setPontosCupcake(0);
			this.repository.saveAndFlush(newUser);
		}
		catch(Exception e)
		{
			System.out.println("Erro ao tentar inserir a foto");
		}
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

	@Transactional
	public UserProfileDTO getUserData(String token) {
		Users user = repository.findByLoginUser(getUserName(token));
		if (user != null)
		{
            return new UserProfileDTO(user.getUsername(),user.getUserFullName(), user.getUserTelefone(), user.getUserCpf(), user.getUserEndereco(), user.getUserEmail(), user.getImagemUsuario(), user.getPontosCupcake());
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

	public void updatePontosCupcake(Users user, int pontos) {
		try
		{
			final int pontosAntigos = user.getPontosCupcake();
			final int pontosNovos = pontosAntigos + pontos;
			user.setPontosCupcake(pontosNovos);
			repository.saveAndFlush(user);
		}
		catch (Exception e)
		{
			throw new RuntimeException("Falha ao tentar inserir os pontos cupcake.\n" + e);
		}
	}

    public ResponseEntity<String> registerUserAvulso(RegisterAvulsoDTO data) {
		if (this.repository.findByUserCpf(data.userCpf()) != null)
			return new ResponseEntity<String>("Usuário já existente.", HttpStatus.BAD_REQUEST);
		else {
			if (data.userFullName() != null && data.userCpf() != null && data.userTelefone() != null && data.userEmail() != null && data.userEndereco() != null) {
				try {

					Users newUser = new Users(data.userFullName(), data.userCpf(), data.userTelefone(), data.userEmail(), data.userEndereco());
					newUser.setUserRole(UserRole.USER);
					newUser.setPontosCupcake(0);
					this.repository.saveAndFlush(newUser);
					return new ResponseEntity<String>("Usuário criado com sucesso.", HttpStatus.CREATED);
				} catch (Exception e) {
					throw new RuntimeException("Erro: " + e);
				}
			} else {
				throw new RuntimeException("Nennhum campo pode estar vazio");
			}
		}
	}

	@Transactional
	public UserDTO getByCpf(String cpf) {
		try
		{
			Users user = repository.findByUserCpf(cpf);
			if (user != null)
			{
				return new UserDTO(user.getUserFullName(), user.getUserCpf(), user.getUserTelefone(), user.getUserEmail(), user.getUserEndereco());
			}
			else{
				return null;
			}
		}
		catch(Exception e)
		{
			throw new RuntimeException("Falha ao buscar o usuário.\n" + e);
		}
	}

	public ResponseEntity<String> alterUserAvulsoData(UserDTO data) {
		if (data.userCpf() == null)
		{
			throw new RuntimeException("O cpf nao pode estar vazio.");
		}
		else{
			Users user = repository.findByUserCpf(data.userCpf());
			if (user == null)
				return new ResponseEntity<String>("Usuário inexistente.", HttpStatus.BAD_REQUEST);
			else {
				if (
						data.userFullName() != null &&
						data.userTelefone() != null &&
						data.userEmail() != null &&
						data.userEndereco() != null) {
					try {
						user.setUserFullName(data.userFullName());
						user.setUserTelefone(data.userTelefone());
						user.setUserEmail(data.userEmail());
						user.setUserEndereco(data.userEndereco());

						this.repository.saveAndFlush(user);
						return new ResponseEntity<String>("Usuário alterado com sucesso.", HttpStatus.CREATED);
					} catch (Exception e) {
						throw new RuntimeException("Erro: " + e);
					}
				} else {
					throw new RuntimeException("Nennhum campo pode estar vazio");
				}
			}
		}
	}

	public void autorizeUserSession(String token) {
		Empresas empresa = getEmpresaByToken(token);
		if (empresa == null) throw new AuthenticationException("Erro na autenticação.");
	}

    public List<EmpregadosDTO> getEmpregadosByEmpresa(String token) {
    	try
		{
			Empresas empresa = getEmpresaByToken(token);
			if (empresa == null) throw new AuthenticationException("Falha na autenticação");

			return repository.findByEmpresa(empresa).stream().map(user ->
					new EmpregadosDTO(
							user.getIdUser(),
							user.getUserRole().toString(),
							user.getUserFullName(),
							user.getUserTelefone(),
							user.getUserCpf(),
							user.getUserEndereco(),
							user.getUserEmail())).toList();
		}
		catch (Exception e)
		{
			throw new AuthenticationException("Falha ao tentar resgatar o usuário");
		}
	}

	public List<EmpregadosDTO> searchFuncionario(String token, String query) {
		try {
			Empresas empresa = getEmpresaByToken(token);
			if (empresa == null) throw new AuthenticationException("Falha na autenticação");

			return repository.searchByCpfOrNomeAndEmpresa(query, empresa)
					.stream().map(user ->
							new EmpregadosDTO(
									user.getIdUser(),
									user.getUserRole().toString(),
									user.getUserFullName(),
									user.getUserTelefone(),
									user.getUserCpf(),
									user.getUserEndereco(),
									user.getUserEmail()))
					.toList();
		}
		catch (Exception e)
		{
			throw new AuthenticationException("Falha ao tentar buscar o funcionário");
		}
	}
}
