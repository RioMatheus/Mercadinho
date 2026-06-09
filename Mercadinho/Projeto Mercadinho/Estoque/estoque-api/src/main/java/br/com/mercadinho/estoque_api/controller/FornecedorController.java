package br.com.mercadinho.estoque_api.controller;

import br.com.mercadinho.estoque_api.entity.Fornecedor;
import br.com.mercadinho.estoque_api.service.FornecedorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fornecedores")
public class FornecedorController {

    private final FornecedorService fornecedorService;

    public FornecedorController(
            FornecedorService fornecedorService) {

        this.fornecedorService = fornecedorService;
    }

    @PostMapping
    public Fornecedor salvar(
            @RequestBody Fornecedor fornecedor) {

        return fornecedorService.salvar(
                fornecedor
        );
    }

    @GetMapping
    public List<Fornecedor> listarTodos() {

        return fornecedorService.listarTodos();
    }

    @GetMapping("/{id}")
    public Fornecedor buscarPorId(
            @PathVariable Long id) {

        return fornecedorService.buscarPorId(
                id
        );
    }

    @PutMapping("/{id}")
    public Fornecedor atualizar(
            @PathVariable Long id,
            @RequestBody Fornecedor fornecedor) {

        return fornecedorService.atualizar(
                id,
                fornecedor
        );
    }

    @DeleteMapping("/{id}")
    public void excluir(
            @PathVariable Long id) {

        fornecedorService.excluir(id);
    }
}