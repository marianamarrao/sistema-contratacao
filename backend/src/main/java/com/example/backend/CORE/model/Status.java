package com.example.backend.CORE.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity(name = "status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String descricao;

}
