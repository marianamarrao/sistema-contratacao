package com.example.backend.CORE.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "funcionario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String nome;
    private String email;
    private String telefone;
    private String cargo;
    private String cidade;
    private Double salario;
    @ManyToOne
    @JoinColumn(name="id_status")
    private Status id_status;
    @ManyToOne
    @JoinColumn(name="id_departamento")
    private Departamento id_departamento;

    public Funcionario(Departamento id_departamento, Status id_status, Double salario, String cidade, String cargo, String telefone, String email, String nome) {
        this.id_departamento = id_departamento;
        this.id_status = id_status;
        this.salario = salario;
        this.cidade = cidade;
        this.cargo = cargo;
        this.telefone = telefone;
        this.email = email;
        this.nome = nome;
    }
}
