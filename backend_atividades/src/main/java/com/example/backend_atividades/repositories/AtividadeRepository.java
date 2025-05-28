package com.example.backend_atividades.repositories;

import com.example.backend_atividades.models.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    @Query("SELECT a FROM Atividade a WHERE a.funcionario IN (SELECT f.codFunc FROM Funcionario f WHERE f.cpf = :cpfFuncionario)")
    List<Atividade> findByFuncionarioCpf(@Param("cpfFuncionario") String cpfFuncionario);


    @Query("SELECT a, am.cep as cep, am.rua as rua, am.bairro as bairro FROM Atividade a , Ambiente am WHERE a.id = :id AND a.ambiente = am.codAmb")
    Atividade findByIdAAndAmbiente(@Param("id") Long id);



}
