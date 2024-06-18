package com.example.backend_atividades.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_atividades.models.Funcionario;

import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Funcionario findByCpf(String cpf);

    Optional<Object> findByUsername(String username);
}
