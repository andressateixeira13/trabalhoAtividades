package com.example.backend_atividades.models;

public record DadosUsuario(Long cod, String cpf, String nome, String cargo, String setor, String permissao) {
    public DadosUsuario (Funcionario funcionario){
        this(funcionario.getCodFunc(),
                funcionario.getCpf(),
                funcionario.getNome(),
                funcionario.getCargo(),
                funcionario.getSetor(),
                funcionario.getPermissao());
    }
}
