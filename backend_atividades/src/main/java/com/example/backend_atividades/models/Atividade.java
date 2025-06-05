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

    private String situacao; // status preenchido pelo funcionário

    @Column(columnDefinition = "TEXT")
    private String descricaoSituacao; // preenchido pelo funcionário

    @Lob
    private byte[] foto; // preenchido pelo funcionário

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Long tipoAtividade;
    private Long funcionario;
    private Long ambiente;

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

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public String getDescricaoSituacao() {
        return descricaoSituacao;
    }

    public void setDescricaoSituacao(String descricaoSituacao) {
        this.descricaoSituacao = descricaoSituacao;
    }

    public byte[] getFoto() {
        return foto;
    }

    public void setFoto(byte[] foto) {
        this.foto = foto;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
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
