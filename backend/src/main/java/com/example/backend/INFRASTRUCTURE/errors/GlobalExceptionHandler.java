package com.example.backend.INFRASTRUCTURE.errors;

import com.example.backend.CORE.errors.AlreadyExistsException;
import com.example.backend.CORE.errors.InvalidDepartamentoException;
import com.example.backend.CORE.errors.InvalidStatusException;
import com.example.backend.CORE.errors.NotFoundException;
import com.example.backend.INFRASTRUCTURE.dto.errors.ErroResponse;
import org.hibernate.annotations.NotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidDepartamentoException.class)
    public ResponseEntity<ErroResponse> handlerInvalidDepartamento(InvalidDepartamentoException mensagem){
        ErroResponse erroResponse = new ErroResponse(
                HttpStatus.NOT_FOUND.value()
                ,mensagem.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erroResponse);
    }

    @ExceptionHandler(InvalidStatusException.class)
    public ResponseEntity<ErroResponse> handlerInvalidStatus(InvalidStatusException mensagem){
        ErroResponse erroResponse = new ErroResponse(
                HttpStatus.NOT_FOUND.value()
                ,mensagem.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erroResponse);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErroResponse> handlerNotFound(NotFoundException mensagem){
        ErroResponse erroResponse = new ErroResponse(
                HttpStatus.NOT_FOUND.value()
                ,mensagem.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erroResponse);
    }

    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<ErroResponse> handlerAlreadyExists(AlreadyExistsException mensagem){
        ErroResponse erroResponse = new ErroResponse(
                HttpStatus.ALREADY_REPORTED.value()
                ,mensagem.getMessage()
        );
        return ResponseEntity.status(HttpStatus.ALREADY_REPORTED).body(erroResponse);
    }
}
