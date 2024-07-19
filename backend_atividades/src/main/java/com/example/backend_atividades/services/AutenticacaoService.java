package com.example.backend_atividades.services;

import com.example.backend_atividades.models.Funcionario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend_atividades.repositories.FuncionarioRepository;

@Service
public class AutenticacaoService implements UserDetailsService {

    private final FuncionarioRepository funcionarioRepository;

    @Autowired
    public AutenticacaoService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Funcionario usuario = this.funcionarioRepository.findByCpf(username);
        if (usuario ==null){
            throw new UsernameNotFoundException("Usuário ou senha incorretos");
        }
        else {
            UserDetails user = User.withUsername(usuario.getCpf()).password(usuario.getSenha())
                    .authorities(usuario.getPermissao()).build();
            return user;
        }
    }
}
