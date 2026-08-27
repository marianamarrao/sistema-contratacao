package com.example.backend.CORE.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity(name = "departamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Departamento {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String descricao;

}
