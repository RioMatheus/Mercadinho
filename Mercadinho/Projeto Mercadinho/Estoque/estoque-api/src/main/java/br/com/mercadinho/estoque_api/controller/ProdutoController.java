package br.com.mercadinho.estoque_api.controller;

import br.com.mercadinho.estoque_api.dto.DashboardResponse;
import br.com.mercadinho.estoque_api.entity.Produto;
import br.com.mercadinho.estoque_api.service.ProdutoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(
            ProdutoService produtoService) {

        this.produtoService = produtoService;
    }

    @PostMapping
    public Produto salvar(
            @RequestBody Produto produto) {

        return produtoService.salvar(produto);
    }

    @GetMapping
    public List<Produto> listarTodos() {

        return produtoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(
            @PathVariable Long id) {

        return produtoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Produto atualizar(
            @PathVariable Long id,
            @RequestBody Produto produto) {

        return produtoService.atualizar(
                id,
                produto
        );
    }

    @DeleteMapping("/{id}")
    public void excluir(
            @PathVariable Long id) {

        produtoService.excluir(id);
    }

    @GetMapping("/estoque-baixo")
    public List<Produto> estoqueBaixo() {

        return produtoService.listarEstoqueBaixo();
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {

        return produtoService.dashboard();
    }
}