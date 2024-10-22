package com.ecommerce.entities.dto;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

public record EmpregadosDTO(String id, String authorities, String nome, String telefone, String cpf, String endereco, String email) {
}
