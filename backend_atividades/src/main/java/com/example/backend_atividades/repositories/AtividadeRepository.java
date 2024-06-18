package com.example.backend_atividades.repositories;

import com.example.backend_atividades.models.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    @Query("SELECT a FROM Atividade a WHERE a.funcionario.id = :idFuncionario")
    List<Atividade> findByFuncionarioId(@Param("idFuncionario") Long idFuncionario);
}
