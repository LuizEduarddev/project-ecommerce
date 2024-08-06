package com.ecommerce.entities.dto;

import com.ecommerce.entities.UserRole;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public record RegisterDTO(String login, String password, UserRole role, Optional<MultipartFile> file) {
}