package com.example.backend_atividades.repositories;

import com.example.backend_atividades.models.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    @Query("SELECT a FROM Atividade a, Funcionario f WHERE a.funcionario.cpf = :cpfFuncionario")
    List<Atividade> findByFuncionarioCpf(@Param("cpfFuncionario") String cpfFuncionario);
}
