package com.ecommerce.entities;

public enum UserRole {
    ADMIN("admin"),
    USER("user"),
    COZINHACAFE("cozinha-cafe"),
    GERENTE("gerente"),
    GARCOM("garcom");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}