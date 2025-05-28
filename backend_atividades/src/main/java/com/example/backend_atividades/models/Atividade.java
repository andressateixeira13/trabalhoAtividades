package com.example.backend_atividades.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeAtiv;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private LocalDate data;

    @JoinColumn(name = "tipo_atividade_id", nullable = false)
    private Long tipoAtividade;

    @JoinColumn(name = "funcionario_id", nullable = false)
    private Long funcionario;
    @JoinColumn(name = "ambiente_id", nullable = false)
    private Long ambiente;

    public Atividade() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeAtiv() {
        return nomeAtiv;
    }

    public void setNomeAtiv(String nomeAtiv) {
        this.nomeAtiv = nomeAtiv;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Long getTipoAtividade() {
        return tipoAtividade;
    }

    public void setTipoAtividade(Long tipoAtividade) {
        this.tipoAtividade = tipoAtividade;
    }

    public Long getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Long funcionario) {
        this.funcionario = funcionario;
    }

    public Long getAmbiente() {
        return ambiente;
    }

    public void setAmbiente(Long ambiente) {
        this.ambiente = ambiente;
    }
}
