package com.example.backend_atividades.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend_atividades.models.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Funcionario findByCpf(String cpf);
}
