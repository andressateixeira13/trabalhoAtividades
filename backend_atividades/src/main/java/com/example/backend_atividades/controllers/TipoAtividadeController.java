package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.TipoAtividade;
import com.example.backend_atividades.services.TipoAtividadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipoatividade")
public class TipoAtividadeController {

    @Autowired
    private TipoAtividadeService tipoAtividadeService;

    @PostMapping
    public ResponseEntity<TipoAtividade> criarTipoAtividade(@RequestBody TipoAtividade tipoAtividade) {
        TipoAtividade novoTipoAtividade = tipoAtividadeService.criarTipoAtividade(tipoAtividade);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTipoAtividade);
    }

    @PutMapping
    public ResponseEntity<TipoAtividade> editarTipoAtividade(@RequestBody TipoAtividade tipoAtividade) {
        TipoAtividade tipoAtividadeEditado = tipoAtividadeService.editarTipoAtividade(tipoAtividade);
        return ResponseEntity.ok(tipoAtividadeEditado);
    }

    @DeleteMapping("/{codTipoAtividade}")
    public ResponseEntity<Void> excluirTipoAtividade(@PathVariable Long codTipoAtividade) {
        tipoAtividadeService.excluirTipoAtividade(codTipoAtividade);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<TipoAtividade>> listarTodos() {
        List<TipoAtividade> tipos = tipoAtividadeService.listarTodos();
        return ResponseEntity.ok(tipos);
    }
}
