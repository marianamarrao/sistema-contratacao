package com.example.backend.CORE.errors;

public class InvalidStatusException extends RuntimeException {
    public InvalidStatusException(String descricao) {
        super("Status inválido: " + descricao);
    }
}
