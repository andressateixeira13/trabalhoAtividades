package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.Atividade;
import com.example.backend_atividades.services.AtividadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atividades")
public class AtividadeController {

    @Autowired
    private AtividadeService atividadeService;

    @GetMapping
    public List<Atividade> listarAtividades() {
        return atividadeService.listarAtividades();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atividade> buscarAtividadePorId(@PathVariable Long id) {
        Atividade atividade = atividadeService.buscarAtividadePorId(id);
        return ResponseEntity.ok(atividade);
    }

    @PostMapping
    public ResponseEntity<Atividade> salvarAtividade(@RequestBody Atividade atividade) {
        Atividade novaAtividade = atividadeService.salvarAtividade(atividade);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaAtividade);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAtividade(@PathVariable Long id) {
        atividadeService.deletarAtividade(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/funcionario/{cpfFuncionario}")
    public ResponseEntity<List<Atividade>> listarAtividadesPorFuncionario(@PathVariable String cpfFuncionario) {
        System.out.println("Buscando atividades para o CPF: " + cpfFuncionario);
        List<Atividade> atividades = atividadeService.listarAtividadesPorFuncionario(cpfFuncionario);
        System.out.println(atividades);
        if (atividades.isEmpty()) {
            System.out.println("Nenhuma atividade encontrada para o CPF: " + cpfFuncionario);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(atividades);
    }

}
