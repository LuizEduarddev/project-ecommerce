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
						.requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/get-by-cpf").hasAnyAuthority(
								String.valueOf(UserRole.GARCOM.getRole()),
								String.valueOf(UserRole.BALCAO.getRole())
						)
						.requestMatchers(HttpMethod.POST, "/api/auth/alter/avulso").hasAuthority(String.valueOf(UserRole.BALCAO.getRole()))
						.requestMatchers(HttpMethod.POST, "/api/auth/get-by-id").hasAuthority(String.valueOf(UserRole.ADMIN.getRole()))
						.requestMatchers(HttpMethod.POST, "/api/auth/get-username").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/register/avulso").hasAuthority(String.valueOf(UserRole.BALCAO.getRole()))
						.requestMatchers(HttpMethod.POST, "/api/auth/profile").hasAuthority(String.valueOf(UserRole.ADMIN.getRole()))
						.requestMatchers(HttpMethod.POST, "/api/auth/alter-profile").hasAuthority(String.valueOf(UserRole.ADMIN.getRole()))
						.requestMatchers(HttpMethod.GET, "/api/auth/get-all").hasAuthority(String.valueOf(UserRole.ADMIN.getRole()))

						//.requestMatchers(HttpMethod.POST, "/api/products/add").hasRole("ADMIN")
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
