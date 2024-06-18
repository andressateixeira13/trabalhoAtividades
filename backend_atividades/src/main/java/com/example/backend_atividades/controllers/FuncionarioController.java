package com.example.backend_atividades.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend_atividades.models.Funcionario;
import com.example.backend_atividades.services.FuncionarioService;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {
    @Autowired
    private FuncionarioService funcionarioService;

    @PostMapping("/login")
    public ResponseEntity<Funcionario> login(@RequestBody Funcionario loginRequest) {
        Funcionario funcionario = funcionarioService.autenticar(loginRequest.getCpf(), loginRequest.getSenha());
        if (funcionario != null) {
            return ResponseEntity.ok(funcionario);
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<String> cadastrar(@RequestBody Funcionario novoFuncionario, @RequestParam String gerenteCpf, @RequestParam String gerenteSenha) {
        Funcionario gerente = funcionarioService.autenticar(gerenteCpf, gerenteSenha);
        if (gerente != null && "gerente".equalsIgnoreCase(gerente.getCargo())) {
            funcionarioService.cadastrar(novoFuncionario);
            return ResponseEntity.ok("Novo funcionário cadastrado com sucesso!");
        } else {
            return ResponseEntity.status(403).body("Permissão negada.");
        }
    }

    @PutMapping("/{id}")
    public Funcionario updateFuncionario(@PathVariable Long id, @RequestBody Funcionario funcionario) {
        return funcionarioService.updateFuncionario(id, funcionario);
    }
}
