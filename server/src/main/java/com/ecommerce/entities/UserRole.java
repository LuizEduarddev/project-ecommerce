package com.ecommerce.entities;

import java.util.ArrayList;
import java.util.List;

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

    public static boolean isValidRole(String role) {
        for (UserRole c : UserRole.values()) {
            if (c.getRole().equalsIgnoreCase(role)) {
                return true;
            }
        }
        return false;
    }

    public static UserRole fromString(String role) {
        for (UserRole userRole : UserRole.values()) {
            if (userRole.getRole().equalsIgnoreCase(role)) {
                return userRole;
            }
        }
        throw new IllegalArgumentException("No enum constant for role: " + role);
    }

    public static List<String> getAllRoles() {
        List<String> roles = new ArrayList<>();
        for (UserRole role : UserRole.values()) {
            roles.add(role.getRole());
        }
        return roles;
    }

    public String getRole(){
        return role;
    }
}