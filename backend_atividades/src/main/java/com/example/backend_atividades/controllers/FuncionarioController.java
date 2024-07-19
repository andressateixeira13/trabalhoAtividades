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
    public ResponseEntity cadastrar(@RequestBody @Valid Funcionario novoFuncionario, UriComponentsBuilder uriBuilder) {
        this.funcionarioService.cadastrar(novoFuncionario);
        URI uri = uriBuilder.path("/{cod}").buildAndExpand(novoFuncionario.getCodFunc()).toUri();
        return ResponseEntity.created(uri).body(novoFuncionario);
    }

    @GetMapping("{cod}")
    public DadosUsuario findById(@PathVariable Long cod){
        return this.funcionarioService.findFuncionario(cod);
    }

    @GetMapping("/list")
    public List<DadosUsuario> findAll(){
        return this.funcionarioService.findAllFuncionarios();
    }

}
