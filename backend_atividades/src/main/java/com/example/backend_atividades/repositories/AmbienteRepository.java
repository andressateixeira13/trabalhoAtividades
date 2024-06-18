package com.example.backend_atividades.repositories;

import com.example.backend_atividades.models.Ambiente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AmbienteRepository extends JpaRepository<Ambiente, Long> {
}
