package com.example.backend.ADAPTER.database;

import com.example.backend.ADAPTER.gateways.FuncionarioGateway;
import com.example.backend.CORE.model.Departamento;
import com.example.backend.CORE.model.Funcionario;
import com.example.backend.INFRASTRUCTURE.repository.FuncionarioRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class FuncionarioAdapter implements FuncionarioGateway {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioAdapter(FuncionarioRepository funcionarioRepository){
        this.funcionarioRepository = funcionarioRepository;
    }

    @Override
    public List<Funcionario> getAllFuncionario() {
        return funcionarioRepository.findAll();
    }

    @Override
    public Optional<Funcionario> getFuncionario(Integer id){
        return funcionarioRepository.findById(id);
    }

    @Override
    public Funcionario addFuncionario(Funcionario funcionario){
        return funcionarioRepository.save(funcionario);
    }

    @Override
    public Funcionario putFuncionario(Integer id, Funcionario funcionario){
        funcionario.setId(id);
        return funcionarioRepository.save(funcionario);
    }

    @Override
    public void deleteFuncionario(Integer id){
        funcionarioRepository.deleteById(id);
    }

    @Override
    public boolean emailAlreadyExists(String email){
        return funcionarioRepository.existsByEmail(email);
    }

    @Override
    public List<Funcionario> findAllByEmail(String valor){
        return funcionarioRepository.findAllByEmail(valor);
    }

    @Override
    public List<Funcionario> findAllByNome(String valor){
        return funcionarioRepository.findAllByNome(valor);
    }

    @Override
    public List<Funcionario> findAllByCargo(String valor){
        return funcionarioRepository.findAllByCargo(valor);
    }
}
