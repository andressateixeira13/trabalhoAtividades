package com.example.backend_atividades.services;

import com.example.backend_atividades.models.Atividade;
import com.example.backend_atividades.repositories.AtividadeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AtividadeService {

    @Autowired
    private AtividadeRepository atividadeRepository;

    private final String baseUrl = "http://localhost:8080/uploads/";

    public List<Atividade> listarAtividades() {
        List<Atividade> atividades = atividadeRepository.findAll();
        return atividades.stream()
                .map(this::mapFotoParaUrl)
                .collect(Collectors.toList());
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

    @Transactional
    public Atividade registrarRetorno(Long id, Atividade dados) {
        Atividade existente = atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada com id: " + id));

        existente.setSituacao(dados.getSituacao());
        existente.setDescricaoSituacao(dados.getDescricaoSituacao());
        existente.setFoto(dados.getFoto()); // campo byte[] ou Blob

        return atividadeRepository.save(existente);
    }

    public Atividade registrarFeedback(Long id, Atividade dados) {
        Atividade existente = atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada com id: " + id));

        existente.setFeedback(dados.getFeedback());

        return atividadeRepository.save(existente);
    }

    public Atividade buscarAtividadePorId(Long id) {
        Atividade atividade = atividadeRepository.findByIdAAndAmbiente(id);
        return mapFotoParaUrl(atividade);
    }

    public List<Atividade> listarAtividadesPorFuncionario(String cpfFuncionario) {
        List<Atividade> atividades = atividadeRepository.findByFuncionarioCpf(cpfFuncionario);
        return atividades.stream()
                .map(this::mapFotoParaUrl)
                .collect(Collectors.toList());
    }

    // Método auxiliar para substituir o nome do arquivo pela URL completa da foto
    private Atividade mapFotoParaUrl(Atividade atividade) {
        if (atividade != null && atividade.getFoto() != null) {
            atividade.setFoto(baseUrl + atividade.getFoto());
        }
        return atividade;
    }


    public void deletarAtividade(Long id) {
        atividadeRepository.deleteById(id);
    }

    public List<Atividade> listarAtividadesPorFuncionarioSemFoto(String cpfFuncionario) {
        List<Atividade> atividades = atividadeRepository.findByFuncionarioCpf(cpfFuncionario);
        return atividades.stream().map(atividade -> {
            atividade.setFoto(null); // Remove conteúdo da imagem
            return atividade;
        }).collect(Collectors.toList());
    }
    public Atividade buscarAtividadeCompletaPorId(Long id) {
        return atividadeRepository.findById(id)
                .map(this::mapFotoParaUrl)
                .orElse(null);
    }

}
