package com.example.backend_atividades.services;

import com.example.backend_atividades.models.TipoAtividade;
import com.example.backend_atividades.repositories.TipoAtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoAtividadeService {

    @Autowired
    private TipoAtividadeRepository tipoAtividadeRepository;

    public TipoAtividade criarTipoAtividade(TipoAtividade tipoAtividade) {
        return tipoAtividadeRepository.save(tipoAtividade);
    }

    public TipoAtividade editarTipoAtividade(TipoAtividade tipoAtividade) {
        return tipoAtividadeRepository.save(tipoAtividade);
    }

    public void excluirTipoAtividade(Long codTipoAtividade) {
        tipoAtividadeRepository.deleteById(codTipoAtividade);
    }
}

