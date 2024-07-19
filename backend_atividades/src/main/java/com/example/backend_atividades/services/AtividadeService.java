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

    public Atividade buscarAtividadePorId(Long id) {
        return atividadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Atividade não encontrada"));
    }

    public void deletarAtividade(Long id) {
        atividadeRepository.deleteById(id);
    }

    public List<Atividade> listarAtividadesPorFuncionario(String cpfFuncionario) {
        return atividadeRepository.findByFuncionarioCpf(cpfFuncionario);
    }
}
