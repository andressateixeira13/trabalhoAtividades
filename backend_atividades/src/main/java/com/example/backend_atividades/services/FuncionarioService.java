package com.example.backend_atividades.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend_atividades.models.Funcionario;
import com.example.backend_atividades.repositories.FuncionarioRepository;

import java.util.Optional;

@Service
public class FuncionarioService {
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Funcionario autenticar(String cpf, String senha) {
        Funcionario funcionario = funcionarioRepository.findByCpf(cpf);
        if (funcionario != null && funcionario.getSenha().equals(senha)) {
            return funcionario;
        }
        return null;
    }

    public Funcionario cadastrar(Funcionario funcionario) {

        return funcionarioRepository.save(funcionario);
    }

    public Funcionario updateFuncionario(Long id, Funcionario updatedFuncionario) {
        Optional<Funcionario> optionalFuncionario = funcionarioRepository.findById(id);
        if (optionalFuncionario.isPresent()) {
            Funcionario funcionario = optionalFuncionario.get();
            funcionario.setNome(updatedFuncionario.getNome());
            funcionario.setCargo(updatedFuncionario.getCargo());
            funcionario.setSenha(updatedFuncionario.getSenha());
            funcionario.setSetor(updatedFuncionario.getSetor());
            return funcionarioRepository.save(funcionario);
        } else {
            throw new RuntimeException("Funcionário não encontrado");
        }
    }
}

