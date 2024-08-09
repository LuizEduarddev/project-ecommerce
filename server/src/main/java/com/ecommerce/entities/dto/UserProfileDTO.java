package com.ecommerce.entities.dto;

public record UserProfileDTO(String loginUser, String nomeCompleto, String telefone, String cpf, String endereco, String email, byte[] imagemUser, int pontosCupcake) {

}
