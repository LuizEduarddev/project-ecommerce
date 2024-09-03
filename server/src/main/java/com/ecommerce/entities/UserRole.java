package com.ecommerce.entities;

public enum UserRole {
    ADMIN("admin"),
    USER("user"),
    BALCAOPREPARO("balcaopreparo"),
    BALCAO("balcao"),
    COZINHA("cozinha"),
    GARCOM("garcom");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}