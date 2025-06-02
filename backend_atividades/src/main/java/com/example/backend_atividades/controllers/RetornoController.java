package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.Retorno;
import com.example.backend_atividades.services.RetornoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/retorno")
public class RetornoController {

    @Autowired
    private RetornoService retornoService;

    @PostMapping
    public ResponseEntity<Retorno> salvarRetorno(@RequestBody Retorno retorno){
        Retorno novoRetorno = retornoService.salvarRetorno(retorno);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoRetorno);
    }

    @GetMapping
    public ResponseEntity<?> listarRetornos() {
        try {
            return ResponseEntity.ok(retornoService.listarRetornos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar retornos: " + e.getMessage());
        }
    }


}
