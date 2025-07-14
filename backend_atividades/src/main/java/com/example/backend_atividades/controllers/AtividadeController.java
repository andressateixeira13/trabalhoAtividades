package com.example.backend_atividades.controllers;

import com.example.backend_atividades.models.Atividade;
import com.example.backend_atividades.services.AtividadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/atividades")
public class AtividadeController {

    @Autowired
    private AtividadeService atividadeService;

    private final Path uploadDir = Paths.get("uploads");

    @PostMapping
    public ResponseEntity<Atividade> salvarAtividade(@RequestBody Atividade atividade) {
        Atividade novaAtividade = atividadeService.salvarAtividade(atividade);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaAtividade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Atividade> atualizarAtividade(@PathVariable Long id, @RequestBody Atividade atividadeAtualizada) {
        Atividade atividade = atividadeService.atualizarAtividade(id, atividadeAtualizada);
        return ResponseEntity.ok(atividade);
    }

    @PutMapping("/{id}/retornos")
    public ResponseEntity<?> atualizarRetorno(
            @PathVariable Long id,
            @RequestParam("descricaoSituacao") String descricao,
            @RequestParam("situacao") String situacao,
            @RequestParam("foto") MultipartFile foto) throws IOException {

        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        String filename = UUID.randomUUID() + "_" + foto.getOriginalFilename();
        Path filepath = uploadDir.resolve(filename);
        Files.write(filepath, foto.getBytes());

        Atividade atividade = atividadeService.buscarAtividadePorId(id);
        atividade.setDescricaoSituacao(descricao);
        atividade.setSituacao(situacao);
        atividade.setFoto(filename); // agora só salva o nome do arquivo

        atividadeService.salvarAtividade(atividade);
        return ResponseEntity.ok("Retorno salvo com imagem.");
    }
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws MalformedURLException {
        Path file = uploadDir.resolve(filename);
        System.out.println("Tentando servir: " + file.toAbsolutePath());

        Resource resource = new UrlResource(file.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = MediaTypeFactory.getMediaType(resource)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(mediaType)
                .body(resource);
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

    @GetMapping
    public List<Atividade> listarAtividades() {
        return atividadeService.listarAtividades();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atividade> buscarAtividadePorId(@PathVariable Long id) {
        Atividade atividade = atividadeService.buscarAtividadeCompletaPorId(id);
        return atividade != null
                ? ResponseEntity.ok(atividade)
                : ResponseEntity.notFound().build();
    }



    @GetMapping("/funcionario/{cpfFuncionario}")
    public ResponseEntity<List<Atividade>> listarAtividadesPorFuncionario(@PathVariable String cpfFuncionario) {
        List<Atividade> atividades = atividadeService.listarAtividadesPorFuncionario(cpfFuncionario);
        return atividades.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(atividades);
    }



}
