package com.example.backend_atividades.controllers;

import com.example.backend_atividades.config.TokenServiceJWT;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AutenticacaoController {
    private final AuthenticationManager manager;
    private final TokenServiceJWT tokenServiceJWT;

    public AutenticacaoController(AuthenticationManager manager, TokenServiceJWT tokenServiceJWT) {
        this.manager = manager;
        this.tokenServiceJWT = tokenServiceJWT;
    }

    @PostMapping
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        try {
            Authentication autenticado = new UsernamePasswordAuthenticationToken(dados.cpf(), dados.senha());
            Authentication at = manager.authenticate(autenticado);

            User user = (User) at.getPrincipal();
            String token = this.tokenServiceJWT.gerarToken(user);

            DadosTokenJWT dadosToken = new DadosTokenJWT(token, dados.cpf());
            System.out.println(dadosToken);

            return ResponseEntity.ok().body(dadosToken);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new DadosTokenJWT(null, e.getMessage()));
        }
    }

    private record DadosTokenJWT(String token, String cpf) {}
    private record DadosAutenticacao(String cpf, String senha) {}
}
