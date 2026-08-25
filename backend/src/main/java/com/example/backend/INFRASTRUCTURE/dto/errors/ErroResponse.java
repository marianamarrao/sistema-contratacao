package com.example.backend.INFRASTRUCTURE.dto.errors;

public record ErroResponse (
        Integer status
        ,String mensagem
){}
