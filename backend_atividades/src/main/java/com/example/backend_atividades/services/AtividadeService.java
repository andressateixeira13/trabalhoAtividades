package com.example.backend_atividades.services;

import com.example.backend_atividades.models.Atividade;
import com.example.backend_atividades.repositories.AtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AtividadeService {

    @Autowired
    private AtividadeRepository atividadeRepository;

    public List<Atividade> listarAtividades() {
        return atividadeRepository.findAll();
    }

    public Atividade salvarAtividade(Atividade atividade) {
        return atividadeRepository.save(atividade);
    }

    public Atividade atualizarAtividade(Long id, Atividade novaAtividade) {
        Atividade existente = atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada com id: " + id));

        existente.setNomeAtiv(novaAtividade.getNomeAtiv());
        existente.setDescricao(novaAtividade.getDescricao());
        existente.setData(novaAtividade.getData());
        existente.setTipoAtividade(novaAtividade.getTipoAtividade());
        existente.setFuncionario(novaAtividade.getFuncionario());
        existente.setAmbiente(novaAtividade.getAmbiente());

        return atividadeRepository.save(existente);
    }

    public Atividade registrarRetorno(Long id, Atividade dados) {
        Atividade existente = atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada com id: " + id));

        existente.setSituacao(dados.getSituacao());
        existente.setDescricaoSituacao(dados.getDescricaoSituacao());
        existente.setFoto(dados.getFoto());

        return atividadeRepository.save(existente);
    }

    public Atividade registrarFeedback(Long id, Atividade dados) {
        Atividade existente = atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada com id: " + id));

        existente.setFeedback(dados.getFeedback());

        return atividadeRepository.save(existente);
    }

    public Atividade buscarAtividadePorId(Long id) {
        return atividadeRepository.findByIdAAndAmbiente(id);
    }

    public void deletarAtividade(Long id) {
        atividadeRepository.deleteById(id);
    }

    public List<Atividade> listarAtividadesPorFuncionario(String cpfFuncionario) {
        return atividadeRepository.findByFuncionarioCpf(cpfFuncionario);
    }
}
