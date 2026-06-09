package br.com.mercadinho.estoque_api.controller;

import br.com.mercadinho.estoque_api.dto.MovimentacaoRequest;
import br.com.mercadinho.estoque_api.dto.ResumoMovimentacaoDTO;
import br.com.mercadinho.estoque_api.entity.Movimentacao;
import br.com.mercadinho.estoque_api.service.MovimentacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoController {

    private final MovimentacaoService movimentacaoService;

    public MovimentacaoController(MovimentacaoService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    @PostMapping("/saida")
    public Movimentacao saida(@RequestBody MovimentacaoRequest request) {
        return movimentacaoService.saida(request);
    }

    @GetMapping
    public List<Movimentacao> listarTodas() {
        return movimentacaoService.listarTodas();
    }

    @GetMapping("/produto/{produtoId}")
    public List<Movimentacao> listarPorProduto(@PathVariable Long produtoId) {
        return movimentacaoService.listarPorProduto(produtoId);
    }

    @GetMapping("/resumo")
    public ResumoMovimentacaoDTO resumo() {
        return movimentacaoService.resumoMovimentacoes();
    }
}

