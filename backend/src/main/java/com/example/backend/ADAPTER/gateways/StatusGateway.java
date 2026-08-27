package com.example.backend.ADAPTER.gateways;

import com.example.backend.CORE.model.Departamento;
import com.example.backend.CORE.model.Status;

import java.util.Optional;

public interface StatusGateway {

    Optional<Status> findStatusByDescricao(String descricao);
}
