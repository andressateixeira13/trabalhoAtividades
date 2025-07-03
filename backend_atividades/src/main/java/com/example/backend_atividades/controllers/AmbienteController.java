package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.Ambiente;
import com.example.backend_atividades.services.AmbienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ambiente")
public class AmbienteController {

    @Autowired
    private AmbienteService ambienteService;

    @PostMapping
    public ResponseEntity<Ambiente> criarAmbiente(@RequestBody Ambiente ambiente) {
        Ambiente novoAmbiente = ambienteService.criarAmbiente(ambiente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoAmbiente);
    }

    @PutMapping
    public ResponseEntity<Ambiente> editarAmbiente(@RequestBody Ambiente ambiente) {
        Ambiente ambienteEditado = ambienteService.editarAmbiente(ambiente);
        return ResponseEntity.ok(ambienteEditado);
    }

    @DeleteMapping("/{codAmbiente}")
    public ResponseEntity<Void> excluirAmbiente(@PathVariable Long codAmbiente) {
        ambienteService.excluirAmbiente(codAmbiente);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ambiente> buscarPorId(@PathVariable Long id) {
        Ambiente ambiente = ambienteService.buscarPorId(id);
        if (ambiente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ambiente);
    }


    @GetMapping("/list")
    public List<Ambiente> listarAmbientes() {
        return ambienteService.listarAmbientes();
    }


}

