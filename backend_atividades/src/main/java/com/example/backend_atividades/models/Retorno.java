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

    public Long getAtividade() {
        return atividade;
    }

    public void setAtividade(Long atividade) {
        this.atividade = atividade;
    }

    @JoinColumn(name = "atividade_id", nullable = false)
    private Long atividade;

    public Long getCodRetorno() {
        return codRetorno;
    }

    public void setCodRetorno(Long codRetorno) {
        this.codRetorno = codRetorno;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getSituacao() {
        return situacao;
    }

    public void setSituacao(String situacao) {
        this.situacao = situacao;
    }

    public byte[] getFoto() {
        return foto;
    }

    public void setFoto(byte[] foto) {
        this.foto = foto;
    }


}
