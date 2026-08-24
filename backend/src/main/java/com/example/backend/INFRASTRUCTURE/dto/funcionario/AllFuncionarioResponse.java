package com.example.backend.INFRASTRUCTURE.dto.funcionario;

import jakarta.validation.constraints.Pattern;

public record AllFuncionarioResponse (
        String nome
        ,
        @Pattern(
                regexp = "^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$"
                ,message = "Digite um e-mail válido!"
        )
        String email
        ,
        @Pattern(
                regexp = "^\\d{10,11}$"
                ,message = "Digite um telefone válido!"
        )
        String telefone
        ,String cargo
        ,String cidade
        ,Double salario
){}
