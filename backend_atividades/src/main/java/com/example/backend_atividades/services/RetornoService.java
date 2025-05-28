package com.example.backend_atividades.services;

import com.example.backend_atividades.models.Atividade;
import com.example.backend_atividades.models.Retorno;
import com.example.backend_atividades.repositories.AtividadeRepository;
import com.example.backend_atividades.repositories.RetornoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class RetornoService {

    @Autowired
    private RetornoRepository retornoRepository;

    @Autowired
    private AtividadeRepository atividadeRepository;

    public Retorno salvarRetorno(Long atividadeId, String descricao, String situacao, MultipartFile foto) throws IOException {
        Atividade atividade = atividadeRepository.findById(atividadeId)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada"));

        Retorno retorno = new Retorno();
        retorno.setDescricao(descricao);
        retorno.setSituacao(situacao);
        retorno.setFoto(foto.getBytes());
        retorno.setAtividade(atividade);

        return retornoRepository.save(retorno);
    }
}
