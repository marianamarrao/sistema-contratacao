package com.example.backend.INFRASTRUCTURE.dto.funcionario;

import com.example.backend.CORE.model.Departamento;
import com.example.backend.CORE.model.Status;
import com.example.backend.INFRASTRUCTURE.dto.departamento.DepartamentoResponse;
import com.example.backend.INFRASTRUCTURE.dto.status.StatusResponse;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record AllFuncionarioResponse (
        Integer id
        ,String nome
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
        , DepartamentoResponse departamento
        , StatusResponse status
        , String cargo
        , String cidade
        , Double salario
){}
