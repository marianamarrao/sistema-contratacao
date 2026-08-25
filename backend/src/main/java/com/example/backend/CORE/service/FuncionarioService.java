package com.example.backend.CORE.service;

import com.example.backend.INFRASTRUCTURE.dto.funcionario.AllFuncionarioRequest;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.AllFuncionarioResponse;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.PatchFuncionarioRequest;

import java.util.List;

public interface FuncionarioService {

    List<AllFuncionarioResponse> getAllFuncionarios();

    AllFuncionarioResponse getFuncionarioPorId(Integer id);

    AllFuncionarioResponse addFuncionario(AllFuncionarioRequest allFuncionarioRequest);

    AllFuncionarioResponse putFuncionario(Integer id,
                                          AllFuncionarioRequest allFuncionarioRequest);

    AllFuncionarioResponse patchFuncionario(Integer id,
                                            PatchFuncionarioRequest patchFuncionarioRequest);

    void deleteFuncionario(Integer id);
}
