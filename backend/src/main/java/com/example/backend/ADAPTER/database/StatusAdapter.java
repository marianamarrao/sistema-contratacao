package com.example.backend.ADAPTER.database;

import com.example.backend.ADAPTER.gateways.StatusGateway;
import com.example.backend.CORE.model.Status;
import com.example.backend.INFRASTRUCTURE.repository.StatusRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StatusAdapter implements StatusGateway {

    private final StatusRepository statusRepository;

    public StatusAdapter(StatusRepository statusRepository){
        this.statusRepository = statusRepository;
    }

    @Override
    public Optional<Status> findStatusByDescricao(String descricao){
        return statusRepository.findByDescricao(descricao);
    }
}
