package com.example.backend.ADAPTER.gateways;

import com.example.backend.CORE.model.Departamento;
import com.example.backend.CORE.model.Funcionario;

import java.util.List;
import java.util.Optional;

public interface FuncionarioGateway {

    List<Funcionario> getAllFuncionario();

    Optional<Funcionario> getFuncionario(Integer id);

    Funcionario addFuncionario(Funcionario funcionario);

    Funcionario putFuncionario(Integer id, Funcionario funcionario);

    void deleteFuncionario(Integer id);

    boolean emailAlreadyExists(String email);

    List<Funcionario> findAllByNome(String valor);

    List<Funcionario> findAllByCargo(String valor);

    List<Funcionario> findAllByEmail(String valor);

}
