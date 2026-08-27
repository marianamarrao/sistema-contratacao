package com.example.backend.ADAPTER.gateways;

import com.example.backend.CORE.model.Departamento;

import java.util.Optional;

public interface DepartamentoGateway {

    Optional<Departamento> findDepartamentoByDescricao(String descricao);
}
