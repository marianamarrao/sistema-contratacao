package com.example.backend.INFRASTRUCTURE.repository;

import com.example.backend.CORE.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    boolean existsByEmail(String email);
}
