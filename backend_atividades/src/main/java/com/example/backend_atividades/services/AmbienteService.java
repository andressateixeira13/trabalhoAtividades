package com.example.backend_atividades.services;


import com.example.backend_atividades.models.Ambiente;
import com.example.backend_atividades.repositories.AmbienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AmbienteService {

    @Autowired
    private AmbienteRepository ambienteRepository;


    public Ambiente criarAmbiente(Ambiente ambiente) {
        return ambienteRepository.save(ambiente);
    }

    public Ambiente editarAmbiente(Ambiente ambiente) {
        return ambienteRepository.save(ambiente);
    }

    public void excluirAmbiente(Long codAmbiente) {
        ambienteRepository.deleteById(codAmbiente);
    }

    public List<Ambiente> listarAmbientes() {return ambienteRepository.findAll();}

    public Ambiente buscarPorId(Long id) {
        return ambienteRepository.findById(id).orElse(null);
    }

}

