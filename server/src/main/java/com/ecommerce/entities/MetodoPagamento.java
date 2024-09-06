package com.ecommerce.entities;

import java.util.ArrayList;
import java.util.List;

public enum MetodoPagamento {
   PIX("pix"),
    CARTAODEBITO("cartaodebito"),
    CARTAOCREDITO("cartaocredito"),
    DINHEIRO("dinheiro");

    private final String value;

    MetodoPagamento(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static boolean isValidCategoria(String categoria) {
        for (MetodoPagamento c : MetodoPagamento.values()) {
            if (c.getValue().equalsIgnoreCase(categoria)) {
                return true;
            }
        }
        return false;
    }

    public static List<String> allCategorias() {
        List<String> categorias = new ArrayList<>();
        for (MetodoPagamento c : MetodoPagamento.values()) {
            categorias.add(c.toString().toUpperCase());
        }
        return categorias;
    }
}