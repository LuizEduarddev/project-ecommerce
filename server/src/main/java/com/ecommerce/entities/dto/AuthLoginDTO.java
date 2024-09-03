package com.ecommerce.entities.dto;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public record AuthLoginDTO(String token, Collection<? extends GrantedAuthority> authorities) {
}
