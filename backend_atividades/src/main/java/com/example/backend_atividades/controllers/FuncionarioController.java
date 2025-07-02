package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.DadosUsuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend_atividades.models.Funcionario;
import com.example.backend_atividades.services.FuncionarioService;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {
    private final FuncionarioService funcionarioService;
    public FuncionarioController(FuncionarioService service){
        this.funcionarioService = service;
    }

    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@RequestBody @Valid Funcionario novoFuncionario, UriComponentsBuilder uriBuilder) {
        this.funcionarioService.cadastrar(novoFuncionario);
        URI uri = uriBuilder.path("/{cod}").buildAndExpand(novoFuncionario.getCodFunc()).toUri();
        return ResponseEntity.created(uri).body(novoFuncionario);
    }

    @PutMapping("{cod}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable Long cod, @RequestBody @Valid Funcionario funcionarioAtualizado) {
        Funcionario atualizado = funcionarioService.atualizar(cod, funcionarioAtualizado);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("{cod}")
    public ResponseEntity<Void> deletar(@PathVariable Long cod) {
        funcionarioService.deletar(cod);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("{cpf}")
    public ResponseEntity<Funcionario> findByCpf(@PathVariable String cpf) {
        Funcionario funcionario = funcionarioService.findByCpf(cpf);
        if (funcionario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(funcionario);
    }

    @GetMapping("/funcionario/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        Funcionario funcionario = funcionarioService.buscarPorId(id);
        if (funcionario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(funcionario);
    }


    @GetMapping("/list")
    public List<DadosUsuario> findAll(){
        return this.funcionarioService.findAllFuncionarios();
    }

}
