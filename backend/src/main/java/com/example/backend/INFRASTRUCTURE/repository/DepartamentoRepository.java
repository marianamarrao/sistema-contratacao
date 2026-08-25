package com.example.backend.INFRASTRUCTURE.repository;

import com.example.backend.CORE.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartamentoRepository extends JpaRepository<Departamento,
        Integer> {
    Optional<Departamento> findByDescricao(String descricao);
}
