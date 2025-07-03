package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.Atividade;
import com.example.backend_atividades.services.AmbienteService;
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

    @Autowired
    private AmbienteService ambienteService;

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

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Atividade> atualizarAtividade(@PathVariable Long id, @RequestBody Atividade atividadeAtualizada) {
        Atividade atividade = atividadeService.atualizarAtividade(id, atividadeAtualizada);
        return ResponseEntity.ok(atividade);
    }

    @PutMapping("/{id}/retorno")
    public ResponseEntity<Atividade> registrarRetorno(@PathVariable Long id, @RequestBody Atividade dadosRetorno) {
        Atividade atividade = atividadeService.buscarAtividadePorId(id);
        if (atividade == null) return ResponseEntity.notFound().build();

        atividade.setSituacao(dadosRetorno.getSituacao());
        atividade.setDescricaoSituacao(dadosRetorno.getDescricaoSituacao());
        atividade.setFoto(dadosRetorno.getFoto());

        return ResponseEntity.ok(atividadeService.salvarAtividade(atividade));
    }

    @PutMapping("/{id}/feedback")
    public ResponseEntity<Atividade> registrarFeedback(@PathVariable Long id, @RequestBody Atividade dadosFeedback) {
        Atividade atividade = atividadeService.buscarAtividadePorId(id);
        if (atividade == null) return ResponseEntity.notFound().build();

        atividade.setFeedback(dadosFeedback.getFeedback());

        return ResponseEntity.ok(atividadeService.salvarAtividade(atividade));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletarAtividade(@PathVariable Long id) {
        atividadeService.deletarAtividade(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/funcionario/{cpfFuncionario}")
    public ResponseEntity<List<Atividade>> listarAtividadesPorFuncionario(@PathVariable String cpfFuncionario) {
        List<Atividade> atividades = atividadeService.listarAtividadesPorFuncionario(cpfFuncionario);
        return atividades.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(atividades);
    }
}
