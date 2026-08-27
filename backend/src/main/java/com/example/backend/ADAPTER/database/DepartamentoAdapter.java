package com.example.backend.ADAPTER.database;

import com.example.backend.ADAPTER.gateways.DepartamentoGateway;
import com.example.backend.CORE.model.Departamento;
import com.example.backend.INFRASTRUCTURE.repository.DepartamentoRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DepartamentoAdapter implements DepartamentoGateway {

    private final DepartamentoRepository departamentoRepository;

    public DepartamentoAdapter(DepartamentoRepository departamentoRepository){
        this.departamentoRepository = departamentoRepository;
    }
    @Override
    public Optional<Departamento> findDepartamentoByDescricao(String descricao){
        return departamentoRepository.findByDescricao(descricao);
    }
}
