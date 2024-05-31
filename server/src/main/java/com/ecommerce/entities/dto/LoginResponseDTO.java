package com.ecommerce.entities.dto;

import java.util.List;
import java.util.Optional;

public record LoginResponseDTO(String token, Optional<Integer> numeroMesa) {

}
