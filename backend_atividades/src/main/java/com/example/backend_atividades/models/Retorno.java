package com.example.backend_atividades.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Retorno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codRetorno;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String situacao;

    @Lob
    private byte[] foto;

    @ManyToOne
    private Atividade atividade;
}
