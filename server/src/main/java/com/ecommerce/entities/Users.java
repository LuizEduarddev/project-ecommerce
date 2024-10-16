package com.ecommerce.entities;

import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity(name = "users")
@Table(name = "users")
public class Users implements UserDetails {

	@Id
	@Column(name = "id_user", nullable = false)
	@GeneratedValue(strategy = GenerationType.UUID)
	private String idUser;

	@Column(name = "login_user", nullable = true)
	private String loginUser;

	@Column(name = "password_user", nullable = true)
	private String passwordUser;

	@Column(name = "user_role", nullable = true)
	@Enumerated(EnumType.STRING)
	private UserRole userRole;

	@Column(name = "user_full_name", nullable = true)
	private String userFullName;

	@Column(name = "user_telefone", nullable = true)
	private String userTelefone;

	@Column(name = "user_cpf", nullable = true, unique = true)
	private String userCpf;

	@Column(name = "user_endereco", nullable = true)
	private String  userEndereco;

	@Column(name = "user_email", nullable = true)
	private String userEmail;

	@Column(name = "pontos_cupcake")
	private int pontosCupcake;

	@Lob
	@Column(name = "imagem_usuario")
	private byte[] imagemUsuario;

	@OneToOne
	private Empresas empresa;

	public Users() {
	}

	public Users(String userFullName, String userCpf, String userTelefone, String userEmail, String userEndereco) {
		this.userFullName = userFullName;
		this.userCpf = userCpf;
		this.userTelefone = userTelefone;
		this.userEmail = userEmail;
		this.userEndereco = userEndereco;
	}

	public Users(String nomeUsuario, String cpf, String numeroTelefone) {
		this.userFullName = nomeUsuario;
		this.userCpf = cpf;
		this.userTelefone = numeroTelefone;
	}

	public Users(String loginUser, String passwordUser, UserRole userRole) {
		this.loginUser = loginUser;
		this.passwordUser = passwordUser;
		this.userRole = userRole;
	}

	public Users(String loginUser, String passwordUser, UserRole userRole, byte[] imagemUsuario) {
		this.loginUser = loginUser;
		this.passwordUser = passwordUser;
		this.userRole = userRole;
		this.imagemUsuario = imagemUsuario;
	}

	public Users(String loginUser, String passwordUser, UserRole userRole, String userFullName, String userTelefone, String userCpf, String userEndereco, String userEmail, int pontosCupcake, byte[] imagemUsuario) {
		this.loginUser = loginUser;
		this.passwordUser = passwordUser;
		this.userRole = userRole;
		this.userFullName = userFullName;
		this.userTelefone = userTelefone;
		this.userCpf = userCpf;
		this.userEndereco = userEndereco;
		this.userEmail = userEmail;
		this.pontosCupcake = pontosCupcake;
		this.imagemUsuario = imagemUsuario;
	}

	public Users(String loginUser, String passwordUser, UserRole userRole, String userFullName, String userTelefone, String userCpf, String userEndereco, String userEmail, int pontosCupcake, byte[] imagemUsuario, Empresas empresa) {
		this.loginUser = loginUser;
		this.passwordUser = passwordUser;
		this.userRole = userRole;
		this.userFullName = userFullName;
		this.userTelefone = userTelefone;
		this.userCpf = userCpf;
		this.userEndereco = userEndereco;
		this.userEmail = userEmail;
		this.pontosCupcake = pontosCupcake;
		this.imagemUsuario = imagemUsuario;
		this.empresa = empresa;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		if (this.userRole == UserRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
		else if (this.userRole == UserRole.COZINHA) return List.of(new SimpleGrantedAuthority("ROLE_COZINHA"));
		else if (this.userRole == UserRole.BALCAOPREPARO) return List.of(new SimpleGrantedAuthority("ROLE_BALCAOPREPARO"));
		else if (this.userRole == UserRole.GARCOM) return List.of(new SimpleGrantedAuthority("ROLE_GARCOM"));
		else if (this.userRole == UserRole.BALCAO) return List.of(new SimpleGrantedAuthority("ROLE_BALCAO"));
		else if (this.userRole == null) return List.of(new SimpleGrantedAuthority("ROLE_USER"));


		else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
	}

	public String getIdUser() {
		return idUser;
	}

	public void setIdUser(String idUser) {
		this.idUser = idUser;
	}

	public String getUserFullName() {
		return userFullName;
	}

	public void setUserFullName(String userFullName) {
		this.userFullName = userFullName;
	}

	public String getUserTelefone() {
		return userTelefone;
	}

	public void setUserTelefone(String userTelefone) {
		this.userTelefone = userTelefone;
	}

	public String getUserCpf() {
		return userCpf;
	}

	public void setUserCpf(String userCpf) {
		this.userCpf = userCpf;
	}

	public String getUserEndereco() {
		return userEndereco;
	}

	public void setUserEndereco(String userEndereco) {
		this.userEndereco = userEndereco;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	@Override
	public String getPassword() {
		return passwordUser;
	}

	@Override
	public String getUsername() {
		return loginUser;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public int getPontosCupcake() {
		return pontosCupcake;
	}

	public void setPontosCupcake(int pontosCupcake) {
		this.pontosCupcake = pontosCupcake;
	}

	public byte[] getImagemUsuario() {
		return imagemUsuario;
	}

	public void setImagemUsuario(byte[] imagemUsuario) {
		this.imagemUsuario = imagemUsuario;
	}

	public UserRole getUserRole() {
		return userRole;
	}

	public void setUserRole(UserRole userRole) {
		this.userRole = userRole;
	}

	public Empresas getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresas empresa) {
		this.empresa = empresa;
	}
}
