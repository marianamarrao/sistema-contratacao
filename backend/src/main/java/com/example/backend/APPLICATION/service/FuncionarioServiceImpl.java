package com.example.backend.APPLICATION.service;

import com.example.backend.ADAPTER.database.DepartamentoAdapter;
import com.example.backend.ADAPTER.database.FuncionarioAdapter;
import com.example.backend.ADAPTER.database.StatusAdapter;
import com.example.backend.CORE.errors.AlreadyExistsException;
import com.example.backend.CORE.errors.InvalidDepartamentoException;
import com.example.backend.CORE.errors.InvalidStatusException;
import com.example.backend.CORE.errors.NotFoundException;
import com.example.backend.CORE.model.Departamento;
import com.example.backend.CORE.model.Funcionario;
import com.example.backend.CORE.model.Status;
import com.example.backend.CORE.service.FuncionarioService;
import com.example.backend.INFRASTRUCTURE.dto.departamento.DepartamentoResponse;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.AllFuncionarioRequest;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.AllFuncionarioResponse;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.PatchFuncionarioRequest;
import com.example.backend.INFRASTRUCTURE.dto.status.StatusResponse;
import com.example.backend.INFRASTRUCTURE.repository.FuncionarioRepository;
import org.springframework.stereotype.Component;

import javax.swing.text.html.Option;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class FuncionarioServiceImpl implements FuncionarioService {

    private final FuncionarioAdapter funcionarioAdapter;
    private final DepartamentoAdapter departamentoAdapter;
    private final StatusAdapter statusAdapter;

    public FuncionarioServiceImpl(FuncionarioAdapter funcionarioAdapter,
                                  DepartamentoAdapter departamentoAdapter,
                                  StatusAdapter statusAdapter) {
        this.funcionarioAdapter = funcionarioAdapter;
        this.departamentoAdapter = departamentoAdapter;
        this.statusAdapter = statusAdapter;
    }

    @Override
    public List<AllFuncionarioResponse> getAllFuncionarios(){
        List<AllFuncionarioResponse> responseList =
                funcionarioAdapter.getAllFuncionario().stream()
                .map(f -> new AllFuncionarioResponse(
                    f.getId()
                    ,f.getNome()
                    ,f.getEmail()
                    ,f.getTelefone()
                    ,new DepartamentoResponse(Optional.ofNullable(f.getId_departamento())
                                                    .map(Departamento::getDescricao)
                                                    .orElse(null))
                    ,new StatusResponse(Optional.ofNullable(f.getId_status())
                                                    .map(Status::getDescricao)
                                                    .orElse(null))
                    ,f.getCargo()
                    ,f.getCidade()
                    ,f.getSalario()
                )).toList();

        if (responseList.isEmpty()){
            throw new NotFoundException("Não encontramos nenhum funcionário " +
                    "cadastrado!");
        }
        return responseList;
    }

    @Override
    public AllFuncionarioResponse addFuncionario(AllFuncionarioRequest allFuncionarioRequest){
        if(funcionarioAdapter.emailAlreadyExists(allFuncionarioRequest.email())){
            throw new AlreadyExistsException("Esse e-mail já foi cadastrado!");
        }

        Funcionario funcionario = funcionarioAdapter.addFuncionario(
                new Funcionario(
                        Optional.ofNullable(allFuncionarioRequest.departamento())
                                .map(descricao -> departamentoAdapter.findDepartamentoByDescricao(descricao)
                                        .orElseThrow(() -> new InvalidDepartamentoException(descricao)))
                                .orElse(null)
                        ,Optional.ofNullable(allFuncionarioRequest.status())
                            .map(descricao -> statusAdapter.findStatusByDescricao(descricao)
                                    .orElseThrow(() -> new InvalidStatusException(descricao)))
                            .orElse(null)
                        ,allFuncionarioRequest.salario()
                        ,allFuncionarioRequest.cidade()
                        ,allFuncionarioRequest.cargo()
                        ,allFuncionarioRequest.telefone()
                        ,allFuncionarioRequest.email()
                        ,allFuncionarioRequest.nome()
                )
        );

        return new AllFuncionarioResponse(
                funcionario.getId()
                ,funcionario.getNome()
                ,funcionario.getEmail()
                ,funcionario.getTelefone()
                ,new DepartamentoResponse(Optional.ofNullable(funcionario.getId_departamento())
                                            .map(Departamento::getDescricao)
                                            .orElse(null))
                ,new StatusResponse(Optional.ofNullable(funcionario.getId_status())
                                            .map(Status::getDescricao)
                                            .orElse(null))
                ,funcionario.getCargo()
                ,funcionario.getCidade()
                ,funcionario.getSalario()
        );
    }

    @Override
    public AllFuncionarioResponse getFuncionarioPorId(Integer id){
        Optional<Funcionario> funcionario =
                funcionarioAdapter.getFuncionario(id);

        if (!funcionario.isPresent()){
            throw new NotFoundException("Funcionário não encontrado com esse " +
                    "ID!");
        }

        Funcionario funcionarioObj = funcionario.get();
        return new AllFuncionarioResponse(
                funcionarioObj.getId()
                ,funcionarioObj.getNome()
                ,funcionarioObj.getEmail()
                ,funcionarioObj.getTelefone()
                ,
                new DepartamentoResponse(Optional.ofNullable(funcionarioObj.getId_departamento())
                                            .map(Departamento::getDescricao)
                                            .orElse(null))
                ,
                new StatusResponse(Optional.ofNullable(funcionarioObj.getId_status())
                                            .map(Status::getDescricao)
                                            .orElse(null))
                ,funcionarioObj.getCargo()
                ,funcionarioObj.getCidade()
                ,funcionarioObj.getSalario()
        );
    }

    @Override
    public AllFuncionarioResponse putFuncionario(Integer id,
                                                 AllFuncionarioRequest allFuncionarioRequest){
        Optional<Funcionario> funcionarioOpt =
                funcionarioAdapter.getFuncionario(id);

        if (!funcionarioOpt.isPresent()){
            throw new NotFoundException("Funcionário não encontrado com esse " +
                    "ID!");
        }

        Funcionario funcionario = funcionarioAdapter.putFuncionario(id,
                new Funcionario(
                    Optional.ofNullable(allFuncionarioRequest.departamento())
                            .map(descricao -> departamentoAdapter.findDepartamentoByDescricao(descricao)
                                    .orElseThrow(() -> new InvalidDepartamentoException(descricao)))
                            .orElse(null)
                    ,Optional.ofNullable(allFuncionarioRequest.status())
                    .map(descricao -> statusAdapter.findStatusByDescricao(descricao)
                            .orElseThrow(() -> new InvalidStatusException(descricao)))
                    .orElse(null)
                    ,allFuncionarioRequest.salario()
                    ,allFuncionarioRequest.cidade()
                    ,allFuncionarioRequest.cargo()
                    ,allFuncionarioRequest.telefone()
                    ,allFuncionarioRequest.email()
                    ,allFuncionarioRequest.nome()
        ));

        return new AllFuncionarioResponse(
                funcionario.getId()
                ,funcionario.getNome()
                ,funcionario.getEmail()
                ,funcionario.getTelefone()
                ,new DepartamentoResponse(Optional.ofNullable(funcionario.getId_departamento())
                                            .map(Departamento::getDescricao)
                                            .orElse(null))
                ,new StatusResponse(Optional.ofNullable(funcionario.getId_status())
                                            .map(Status::getDescricao)
                                            .orElse(null))
                ,funcionario.getCargo()
                ,funcionario.getCidade()
                ,funcionario.getSalario()
        );
    }

    @Override
    public AllFuncionarioResponse patchFuncionario(Integer id,
                                                   PatchFuncionarioRequest patchFuncionarioRequest){
        Optional<Funcionario> funcionario = funcionarioAdapter.getFuncionario(id);

        if (!funcionario.isPresent()){
            throw new NotFoundException("Funcionário não encontrado com esse " +
                    "ID!");
        }

        Funcionario funcionarioObj = funcionario.get();

        if (patchFuncionarioRequest.cargo() != null){
            funcionarioObj.setCargo(patchFuncionarioRequest.cargo());
        }
        if (patchFuncionarioRequest.departamento() != null){
            funcionarioObj.setId_departamento(departamentoAdapter.findDepartamentoByDescricao(patchFuncionarioRequest.departamento()).get());
        }
        if (patchFuncionarioRequest.status() != null){
            funcionarioObj.setId_status(statusAdapter.findStatusByDescricao(patchFuncionarioRequest.status()).get());
        }
        if (patchFuncionarioRequest.salario() != null){
            funcionarioObj.setSalario(patchFuncionarioRequest.salario());
        }

        funcionarioObj = funcionarioAdapter.addFuncionario(funcionarioObj);
        return new AllFuncionarioResponse(
                funcionarioObj.getId()
                ,funcionarioObj.getNome()
                ,funcionarioObj.getEmail()
                ,funcionarioObj.getTelefone()
                ,
                new DepartamentoResponse(Optional.ofNullable(funcionarioObj.getId_departamento())
                                            .map(Departamento::getDescricao)
                                            .orElse(null))
                ,
                new StatusResponse(Optional.ofNullable(funcionarioObj.getId_status())
                                            .map(Status::getDescricao)
                                            .orElse(null))
                ,funcionarioObj.getCargo()
                ,funcionarioObj.getCidade()
                ,funcionarioObj.getSalario()
        );
    }

    @Override
    public void deleteFuncionario(Integer id){
        Optional<Funcionario> funcionario = funcionarioAdapter.getFuncionario(id);

        if (!funcionario.isPresent()){
            throw new NotFoundException("Funcionário não encontrado com esse " +
                    "ID!");
        }

        funcionarioAdapter.deleteFuncionario(id);
    }


    public List<AllFuncionarioResponse> getByFilter(String valor){
        List<Funcionario> funcionariosEncontrados = new ArrayList<>();

        List<Funcionario> funcionarios =
                (List<Funcionario>) funcionarioAdapter.findAllByCargo(valor);
        if (funcionarios != null) {
            funcionariosEncontrados.addAll(funcionarios);
        }

        funcionarios =
                (List<Funcionario>) funcionarioAdapter.findAllByNome(valor);
        if (funcionarios != null) {
            funcionariosEncontrados.addAll(funcionarios);
        }

        funcionarios =
                (List<Funcionario>) funcionarioAdapter.findAllByEmail(valor);
        if (funcionarios != null) {
            funcionariosEncontrados.addAll(funcionarios);
        }

        if(funcionariosEncontrados.isEmpty()){
            throw new NotFoundException("Não há nenhum funcionário com esse " +
                    "filtro!");
        }

        return funcionariosEncontrados.stream().map(
                f -> new AllFuncionarioResponse(
                        f.getId()
                        ,f.getNome()
                        ,f.getEmail()
                        ,f.getTelefone()
                        ,
                        new DepartamentoResponse(Optional.ofNullable(f.getId_departamento())
                                .map(Departamento::getDescricao)
                                .orElse(null))
                        ,
                        new StatusResponse(Optional.ofNullable(f.getId_status())
                                .map(Status::getDescricao)
                                .orElse(null))
                        ,f.getCargo()
                        ,f.getCidade()
                        ,f.getSalario()
                )
        ).toList();
    }
}
