package com.example.backend.CORE.errors;

public class InvalidDepartamentoException extends RuntimeException {
    public InvalidDepartamentoException(String descricao) {
        super("Status inválido: " + descricao);
    }
}
