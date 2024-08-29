package com.ecommerce.entities;

public enum CategoriaProd {
    BOMBOM("bombom"),
    DOCINHO("docinho"),
    BOLO("bolo");

    private final String value;

    CategoriaProd(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static boolean isValidCategoria(String categoria) {
        for (CategoriaProd c : CategoriaProd.values()) {
            if (c.getValue().equalsIgnoreCase(categoria)) {
                return true;
            }
        }
        return false;
    }
}