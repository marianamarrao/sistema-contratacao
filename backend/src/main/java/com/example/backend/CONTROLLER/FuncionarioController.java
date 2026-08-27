package com.example.backend.CONTROLLER;

import com.example.backend.APPLICATION.service.FuncionarioServiceImpl;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.AllFuncionarioRequest;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.AllFuncionarioResponse;
import com.example.backend.INFRASTRUCTURE.dto.funcionario.PatchFuncionarioRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
@Component
public class FuncionarioController {

    private final FuncionarioServiceImpl funcionarioService;

    public FuncionarioController(FuncionarioServiceImpl funcionarioService){
        this.funcionarioService = funcionarioService;
    }

    @PostMapping()
    public ResponseEntity<AllFuncionarioResponse> addFuncionario(@RequestBody AllFuncionarioRequest allFuncionarioRequest){
        return ResponseEntity.ok(funcionarioService.addFuncionario(allFuncionarioRequest));
    }

    @GetMapping()
    public ResponseEntity<List<AllFuncionarioResponse>> getAllFuncionarios(){
        return ResponseEntity.ok(funcionarioService.getAllFuncionarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AllFuncionarioResponse> getFuncionarioPorId(@PathVariable("id") Integer id){
        return ResponseEntity.ok(funcionarioService.getFuncionarioPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AllFuncionarioResponse> putFuncioanario(@PathVariable("id") Integer id, @RequestBody AllFuncionarioRequest allFuncionarioRequest){
        return ResponseEntity.ok(funcionarioService.putFuncionario(id,
                allFuncionarioRequest));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AllFuncionarioResponse> patchFuncionario(@PathVariable("id") Integer id, @RequestBody PatchFuncionarioRequest patchFuncionarioRequest){
        return ResponseEntity.ok(funcionarioService.patchFuncionario(id,
                patchFuncionarioRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFuncionario(@PathVariable("id") Integer id){
        funcionarioService.deleteFuncionario(id);
        return ResponseEntity.status(HttpStatus.OK).body("Funcionário " +
                "deletado com sucesso!");
    }
}

