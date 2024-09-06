package com.ecommerce.infra.security;

import com.ecommerce.entities.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	@Autowired
	private SecurityFilter securityFilter;

	@Bean
	public SecurityFilterChain security(HttpSecurity http) throws Exception
	{
		return http
				.cors(AbstractHttpConfigurer::disable)
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize
						//AUTH REQUESTS
						.requestMatchers(HttpMethod.POST, "/api/auth/register").hasAnyRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/auth/garcom").hasRole(String.valueOf(UserRole.GARCOM))
						.requestMatchers(HttpMethod.GET, "/api/auth/balcao_preparo").hasRole(String.valueOf(UserRole.BALCAOPREPARO))
						.requestMatchers(HttpMethod.GET, "/api/auth/cozinha").hasRole(String.valueOf(UserRole.COZINHA))
						.requestMatchers(HttpMethod.POST, "/api/auth/get-by-cpf").hasAnyRole(
								String.valueOf(UserRole.GARCOM),
								String.valueOf(UserRole.BALCAO)
						)
						.requestMatchers(HttpMethod.POST, "/api/auth/alter/avulso").hasRole(String.valueOf(UserRole.BALCAO))
						.requestMatchers(HttpMethod.POST, "/api/auth/get-by-id").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/auth/get-username").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/register/avulso").hasRole(String.valueOf(UserRole.BALCAO))
						.requestMatchers(HttpMethod.POST, "/api/auth/profile").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/auth/alter-profile").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.GET, "/api/auth/get-all").hasRole(String.valueOf(UserRole.ADMIN))

						//MESAS REQUEST
						.requestMatchers(HttpMethod.GET, "/api/mesa/get-all").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.GARCOM)
						)
						.requestMatchers(HttpMethod.POST, "/api/mesa/add").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/mesa/update").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/mesa/delete").hasRole(String.valueOf(UserRole.ADMIN))

						//PEDIDOS REQUEST
						.requestMatchers(HttpMethod.GET, "/api/pedidos/get-all").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/pedidos/pendencias").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/pedidos/pronto").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.BALCAOPREPARO),
								String.valueOf(UserRole.COZINHA)
						)
						.requestMatchers(HttpMethod.POST, "/api/pedidos/get-all-admin").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/pedidos/get-by-user").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/pedidos/get-by-id").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.BALCAOPREPARO),
								String.valueOf(UserRole.GARCOM),
								String.valueOf(UserRole.COZINHA)
						)
						.requestMatchers(HttpMethod.POST, "/api/pedidos/get-by-mesa").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.BALCAOPREPARO),
								String.valueOf(UserRole.GARCOM)
						)
						.requestMatchers(HttpMethod.GET, "/api/pedidos/get-for-cozinha").hasRole(String.valueOf(UserRole.COZINHA))
						.requestMatchers(HttpMethod.GET, "/api/pedidos/get-for-balcao-preparo").hasRole(String.valueOf(UserRole.BALCAOPREPARO))
						.requestMatchers(HttpMethod.POST, "/api/pedidos/get-by-cpf").hasRole(String.valueOf(UserRole.GARCOM))
						.requestMatchers(HttpMethod.POST, "/api/pedidos/add").hasRole(String.valueOf(UserRole.GARCOM))


						//PRODUCTS
						.requestMatchers(HttpMethod.GET, "/api/products/get-categories").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.GARCOM)
						)
						.requestMatchers(HttpMethod.GET, "/api/products/get-all").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.GARCOM)
						)
						.requestMatchers(HttpMethod.GET, "/api/products/get-promotion").hasRole(String.valueOf(UserRole.ADMIN))
						.requestMatchers(HttpMethod.POST, "/api/products/search").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.GARCOM)
						)
						.requestMatchers(HttpMethod.POST, "/api/products/search/balcao").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO)
						)
						.requestMatchers(HttpMethod.POST, "/api/products/get-by-id").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.GARCOM)
						)
						.requestMatchers(HttpMethod.POST, "/api/products/get-by-categoria").hasAnyRole(
								String.valueOf(UserRole.ADMIN),
								String.valueOf(UserRole.BALCAO),
								String.valueOf(UserRole.GARCOM)
						)
						.requestMatchers(HttpMethod.POST, "/api/products/get-by-categoria").hasRole(String.valueOf(UserRole.GARCOM))
						.requestMatchers(HttpMethod.POST, "/api/products/add").hasRole(String.valueOf(UserRole.BALCAO))
						.requestMatchers(HttpMethod.PUT, "/api/products/editar").hasRole(String.valueOf(UserRole.BALCAO))
						.requestMatchers(HttpMethod.DELETE, "/api/products/delete").hasRole(String.valueOf(UserRole.BALCAO))





						.anyRequest().permitAll())
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
	
	@Bean
	public AuthenticationManager authentication(AuthenticationConfiguration configuration) throws Exception
	{
		return configuration.getAuthenticationManager();	
	}
	
	@Bean
	public PasswordEncoder passwordEncoder()
	{
		return new BCryptPasswordEncoder();
	}
}
