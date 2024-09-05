package com.ecommerce.entities;

import java.util.ArrayList;
import java.util.List;

public enum CategoriaProd {
    BOMBOM("bombom"),
    DOCINHO("docinho"),
    BOLO("bolo"),
    COZINHA("cozinha");

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

    public static List<String> allCategorias() {
        List<String> categorias = new ArrayList<>();
        for (CategoriaProd c : CategoriaProd.values()) {
            categorias.add(c.toString().toUpperCase());
        }
        return categorias;
    }
}