package br.com.mercadinho.estoque_api.controller;

import br.com.mercadinho.estoque_api.entity.Categoria;
import br.com.mercadinho.estoque_api.service.CategoriaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    public Categoria salvar(@RequestBody Categoria categoria) {
        return categoriaService.salvar(categoria);
    }

    @GetMapping
    public List<Categoria> listarTodos() {
        return categoriaService.listarTodos();
    }

    @PutMapping("/{id}")
    public Categoria atualizar(
            @PathVariable Long id,
            @RequestBody Categoria categoria) {

        return categoriaService.atualizar(id, categoria);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        categoriaService.excluir(id);
    }
}
