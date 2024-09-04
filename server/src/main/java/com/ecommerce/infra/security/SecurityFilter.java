package com.ecommerce.infra.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.repository.UsersRepository;
import com.ecommerce.services.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter{

	@Autowired
	private TokenService tokenService;
	
	@Autowired
	private UsersRepository repository;
	
	  @Override
	    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
          var token = this.recoverToken(request);
          UserDetails user = null;
          if (token != null) {
              var login = tokenService.validateToken(token);
              user = repository.findByLoginUser(login);
              var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
              SecurityContextHolder.getContext().setAuthentication(authentication);
          }
          filterChain.doFilter(request, response);
      }

	private String recoverToken(HttpServletRequest request) {
		var authorizationHeader =  request.getHeader("Authorization");
		if (authorizationHeader != null) {
			return authorizationHeader.replace("Bearer ", "");
		}
		return null;
	}

}
