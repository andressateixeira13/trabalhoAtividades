package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.Retorno;
import com.example.backend_atividades.services.RetornoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/retornos")
public class RetornoController {

    @Autowired
    private RetornoService retornoService;

    @PostMapping
    public ResponseEntity<?> salvarRetorno(
            @RequestParam Long atividadeId,
            @RequestParam String descricao,
            @RequestParam String situacao,
            @RequestParam("foto") MultipartFile foto
    ) {
        try {
            Retorno retorno = retornoService.salvarRetorno(atividadeId, descricao, situacao, foto);
            return ResponseEntity.ok("Retorno salvo com sucesso. ID: " + retorno.getCodRetorno());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar retorno: " + e.getMessage());
        }
    }
}
