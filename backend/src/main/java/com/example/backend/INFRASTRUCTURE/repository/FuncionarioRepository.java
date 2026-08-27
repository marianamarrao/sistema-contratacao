package com.example.backend.INFRASTRUCTURE.repository;

import com.example.backend.CORE.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    boolean existsByEmail(String email);

    List<Funcionario> findAllByEmail(String email);

    List<Funcionario> findAllByNome(String nome);

    List<Funcionario> findAllByCargo(String cargo);
}
