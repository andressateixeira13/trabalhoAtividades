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

   public Funcionario autenticar(String cpf, String senha) {
        Funcionario funcionario = funcionarioRepository.findByCpf(cpf);
        if (funcionario != null && funcionario.getSenha().equals(senha)) {
            return funcionario;
        }
        return null;
    }

    public void cadastrar(Funcionario funcionario) {
        funcionario.setSenha(new BCryptPasswordEncoder().encode(funcionario.getSenha()));
        this.funcionarioRepository.save(funcionario);
    }

   public DadosUsuario findFuncionario(Long cod){
        Funcionario funcionario = this.funcionarioRepository.getReferenceById(cod);
        return new DadosUsuario(funcionario);
   }

   public List<DadosUsuario> findAllFuncionarios(){
        return this.funcionarioRepository.findAll().stream().map(DadosUsuario::new).toList();
   }

}
