package com.example.backend_atividades.repositories;

import com.example.backend_atividades.models.TipoAtividade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoAtividadeRepository extends JpaRepository<TipoAtividade, Long> {
}
