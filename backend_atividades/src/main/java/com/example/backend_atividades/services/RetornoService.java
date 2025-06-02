package com.example.backend_atividades.services;

import com.example.backend_atividades.models.Retorno;
import com.example.backend_atividades.repositories.AtividadeRepository;
import com.example.backend_atividades.repositories.RetornoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RetornoService {

    @Autowired
    private RetornoRepository retornoRepository;

    @Autowired
    private AtividadeRepository atividadeRepository;

    public Retorno salvarRetorno(Retorno retorno){return retornoRepository.save(retorno);}
    public List<Retorno> listarRetornos() {
        return retornoRepository.findAll();
    }



}
