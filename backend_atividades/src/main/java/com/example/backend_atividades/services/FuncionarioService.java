package com.example.backend_atividades.services;

import com.example.backend_atividades.models.DadosUsuario;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.backend_atividades.models.Funcionario;
import com.example.backend_atividades.repositories.FuncionarioRepository;

import java.util.List;

@Service
public class FuncionarioService {
    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public void cadastrar(Funcionario funcionario) {
        funcionario.setSenha(new BCryptPasswordEncoder().encode(funcionario.getSenha()));
        this.funcionarioRepository.save(funcionario);
    }

    public Funcionario atualizar(Long cod, Funcionario dadosAtualizados) {
        Funcionario existente = funcionarioRepository.findById(cod)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        existente.setNome(dadosAtualizados.getNome());
        existente.setCpf(dadosAtualizados.getCpf());
        existente.setCargo(dadosAtualizados.getCargo());

        return funcionarioRepository.save(existente);
    }

    public void deletar(Long cod) {
        Funcionario existente = funcionarioRepository.findById(cod)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));

        funcionarioRepository.delete(existente);
    }

    public Funcionario findByCpf(String cpf) {
        return funcionarioRepository.findByCpf(cpf);
    }




   public List<DadosUsuario> findAllFuncionarios(){
        return this.funcionarioRepository.findAll().stream().map(DadosUsuario::new).toList();
   }

    public Funcionario buscarPorId(Long id) {
        return funcionarioRepository.findById(id).orElse(null);
    }

}
