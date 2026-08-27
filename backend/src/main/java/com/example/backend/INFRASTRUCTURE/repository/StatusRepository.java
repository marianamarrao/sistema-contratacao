package com.example.backend.INFRASTRUCTURE.repository;

import com.example.backend.CORE.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status,Integer> {
    Optional<Status> findByDescricao(String descricao);
}
