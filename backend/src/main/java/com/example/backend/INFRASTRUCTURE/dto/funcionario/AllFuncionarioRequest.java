package com.example.backend.INFRASTRUCTURE.dto.funcionario;

import com.example.backend.CORE.model.Departamento;
import com.example.backend.CORE.model.Status;
import jakarta.validation.constraints.Pattern;

public record AllFuncionarioRequest(
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
        , String departamento
        , String status
        , String cargo
        , String cidade
        , Double salario
){}