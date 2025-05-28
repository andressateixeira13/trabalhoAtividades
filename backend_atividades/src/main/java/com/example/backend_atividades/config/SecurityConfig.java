package com.example.backend_atividades.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AutenticacaoFilter autenticacaoFilter;

    public SecurityConfig(AutenticacaoFilter autenticacaoFilter) {
        this.autenticacaoFilter = autenticacaoFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/funcionarios").permitAll()
                        .requestMatchers(HttpMethod.GET, "/funcionarios").permitAll()
                        .requestMatchers(HttpMethod.POST, "/ambiente").hasAnyAuthority("ROLE_GESTOR")
                        .requestMatchers(HttpMethod.GET, "/ambiente").hasAnyAuthority("ROLE_FUNCIONARIO", "ROLE_GESTOR")
                        .requestMatchers(HttpMethod.POST, "/atividades").hasAnyAuthority("ROLE_GESTOR")
                        .requestMatchers(HttpMethod.GET, "/atividades").hasAnyAuthority("ROLE_FUNCIONARIO", "ROLE_GESTOR")
                        .requestMatchers(HttpMethod.GET, "/atividades/**").hasAnyAuthority("ROLE_FUNCIONARIO", "ROLE_GESTOR")
                        .requestMatchers(HttpMethod.POST, "/feadback").hasAnyAuthority("ROLE_GESTOR")
                        .requestMatchers(HttpMethod.GET, "/feadback").hasAnyAuthority("ROLE_GESTOR", "ROLE_FUNCIONARIO")
                        .requestMatchers(HttpMethod.POST, "/retorno").hasAnyAuthority("ROLE_FUNCIONARIO")
                        .requestMatchers(HttpMethod.GET, "/retorno").hasAnyAuthority("ROLE_FUNCIONARIO", "ROLE_GESTOR")
                        .requestMatchers(HttpMethod.POST, "/tipoAtividade").hasAnyAuthority("ROLE_GESTOR")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(this.autenticacaoFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
