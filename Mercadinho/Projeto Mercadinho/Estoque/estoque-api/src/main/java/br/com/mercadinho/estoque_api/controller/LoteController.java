package br.com.mercadinho.estoque_api.controller;

import br.com.mercadinho.estoque_api.entity.Lote;
import br.com.mercadinho.estoque_api.service.LoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lotes")
public class LoteController {

    private final LoteService loteService;

    public LoteController(LoteService loteService) {
        this.loteService = loteService;
    }

    @PostMapping
    public Lote salvar(@RequestBody Lote lote) {
        return loteService.salvar(lote);
    }

    @GetMapping
    public List<Lote> listar() {
        return loteService.listarTodos();
    }

    @GetMapping("/{id}")
    public Lote buscar(@PathVariable Long id) {
        return loteService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        loteService.excluir(id);
    }
}