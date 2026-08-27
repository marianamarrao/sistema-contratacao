package com.example.backend.INFRASTRUCTURE.dto.funcionario;

public record PatchFuncionarioRequest(
    String cargo
    ,String departamento
    ,String status
    ,Double salario
) {}