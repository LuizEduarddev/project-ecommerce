package com.ecommerce.entities.dto;

import com.ecommerce.entities.UserRole;

public record RegisterDTO(String login, String password, UserRole role) {
}