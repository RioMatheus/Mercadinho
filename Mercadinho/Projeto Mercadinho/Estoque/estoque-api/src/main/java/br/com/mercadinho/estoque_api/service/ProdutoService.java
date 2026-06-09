package br.com.mercadinho.estoque_api.service;

import br.com.mercadinho.estoque_api.dto.DashboardResponse;
import br.com.mercadinho.estoque_api.entity.Movimentacao;
import br.com.mercadinho.estoque_api.entity.Produto;
import br.com.mercadinho.estoque_api.enums.MotivoSaida;
import br.com.mercadinho.estoque_api.enums.StatusEstoque;
import br.com.mercadinho.estoque_api.enums.TipoMovimentacao;
import br.com.mercadinho.estoque_api.repository.CategoriaRepository;
import br.com.mercadinho.estoque_api.repository.LoteRepository;
import br.com.mercadinho.estoque_api.repository.MovimentacaoRepository;
import br.com.mercadinho.estoque_api.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final MovimentacaoRepository movimentacaoRepository;
    private final LoteRepository loteRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(
            ProdutoRepository produtoRepository,
            MovimentacaoRepository movimentacaoRepository,
            LoteRepository loteRepository,
            CategoriaRepository categoriaRepository) {

        this.produtoRepository = produtoRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.loteRepository = loteRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public Produto salvar(Produto produto) {
        validarCategoria(produto.getCategoria());
        atualizarStatus(produto);
        return produtoRepository.save(produto);
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto nao encontrado"));
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = buscarPorId(id);
        validarCategoria(produtoAtualizado.getCategoria());

        produto.setCodigoBarras(produtoAtualizado.getCodigoBarras());
        produto.setNome(produtoAtualizado.getNome());
        produto.setMarca(produtoAtualizado.getMarca());
        produto.setCategoria(produtoAtualizado.getCategoria());
        produto.setDescricao(produtoAtualizado.getDescricao());
        produto.setUnidadeMedida(produtoAtualizado.getUnidadeMedida());
        produto.setPrecoCompra(produtoAtualizado.getPrecoCompra());
        produto.setPrecoVenda(produtoAtualizado.getPrecoVenda());
        produto.setQuantidade(produtoAtualizado.getQuantidade());
        produto.setEstoqueMinimo(produtoAtualizado.getEstoqueMinimo());
        produto.setFornecedor(produtoAtualizado.getFornecedor());

        atualizarStatus(produto);

        return produtoRepository.save(produto);
    }

    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }

    public List<Produto> listarEstoqueBaixo() {
        return produtoRepository.findByStatusEstoque(
                StatusEstoque.ESTOQUE_BAIXO
        );
    }

    public DashboardResponse dashboard() {
        PeriodoControle periodo = calcularPeriodoControle();
        LocalDate hoje = LocalDate.now();

        BigDecimal valorInvestido = produtoRepository.findAll()
                .stream()
                .map(produto -> calcularValor(produto.getPrecoCompra(), produto.getQuantidade()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Movimentacao> movimentacoesPeriodo =
                movimentacaoRepository.findByDataHoraBetween(
                        periodo.inicio(),
                        periodo.fim()
                );

        BigDecimal valorSaidaVenda = movimentacoesPeriodo
                .stream()
                .filter(this::ehVenda)
                .map(movimentacao -> calcularValor(
                        movimentacao.getProduto().getPrecoVenda(),
                        movimentacao.getQuantidade()
                ))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal custoProdutosVendidos = movimentacoesPeriodo
                .stream()
                .filter(this::ehVenda)
                .map(movimentacao -> calcularValor(
                        movimentacao.getProduto().getPrecoCompra(),
                        movimentacao.getQuantidade()
                ))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal perdas = calcularCustoPorMotivo(movimentacoesPeriodo, MotivoSaida.PERDA);
        BigDecimal danos = calcularCustoPorMotivo(movimentacoesPeriodo, MotivoSaida.DANO);
        BigDecimal validade = calcularCustoPorMotivo(movimentacoesPeriodo, MotivoSaida.VALIDADE);
        BigDecimal lucroEstimado = valorSaidaVenda
                .subtract(custoProdutosVendidos)
                .subtract(perdas)
                .subtract(danos)
                .subtract(validade);

        return DashboardResponse.builder()
                .totalProdutos(produtoRepository.count())
                .produtosEstoqueBaixo((long) listarEstoqueBaixo().size())
                .produtosVencidos(contarProdutosVencidos(hoje))
                .produtosProximosVencimento(contarProdutosProximosVencimento(hoje))
                .periodoInicio(periodo.inicio().toLocalDate())
                .periodoFim(periodo.fim().toLocalDate())
                .valorEntrada(valorInvestido)
                .valorSaidaVenda(valorSaidaVenda)
                .lucroPeriodo(lucroEstimado)
                .valorInvestido(valorInvestido)
                .valorFaturado(valorSaidaVenda)
                .lucroEstimado(lucroEstimado)
                .perdas(perdas)
                .danos(danos)
                .validade(validade)
                .build();
    }

    private void atualizarStatus(Produto produto) {
        if (produto.getQuantidade() <= produto.getEstoqueMinimo()) {
            produto.setStatusEstoque(StatusEstoque.ESTOQUE_BAIXO);
        } else {
            produto.setStatusEstoque(StatusEstoque.NORMAL);
        }
    }

    private boolean ehVenda(Movimentacao movimentacao) {
        return movimentacao.getTipoMovimentacao() == TipoMovimentacao.SAIDA
                && movimentacao.getMotivoSaida() == MotivoSaida.VENDA;
    }

    private void validarCategoria(String categoria) {
        if (categoria == null || categoria.isBlank()) {
            throw new RuntimeException("Categoria e obrigatoria");
        }

        if (!categoriaRepository.existsByNomeIgnoreCase(categoria.trim())) {
            throw new RuntimeException("Categoria nao cadastrada");
        }
    }

    private BigDecimal calcularCustoPorMotivo(
            List<Movimentacao> movimentacoes,
            MotivoSaida motivo) {

        return movimentacoes
                .stream()
                .filter(movimentacao -> movimentacao.getTipoMovimentacao() == TipoMovimentacao.SAIDA)
                .filter(movimentacao -> movimentacao.getMotivoSaida() == motivo)
                .map(movimentacao -> calcularValor(
                        movimentacao.getProduto().getPrecoCompra(),
                        movimentacao.getQuantidade()
                ))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calcularValor(BigDecimal valorUnitario, Integer quantidade) {
        if (valorUnitario == null || quantidade == null) {
            return BigDecimal.ZERO;
        }

        return valorUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    private Long contarProdutosVencidos(LocalDate hoje) {
        return loteRepository.findByDataValidadeBefore(hoje)
                .stream()
                .filter(lote -> lote.getProduto() != null)
                .map(lote -> lote.getProduto().getId())
                .distinct()
                .count();
    }

    private Long contarProdutosProximosVencimento(LocalDate hoje) {
        return loteRepository.findByDataValidadeBetween(hoje, hoje.plusDays(30))
                .stream()
                .filter(lote -> lote.getProduto() != null)
                .map(lote -> lote.getProduto().getId())
                .distinct()
                .count();
    }

    private PeriodoControle calcularPeriodoControle() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio;
        LocalDate fim;

        if (hoje.getDayOfMonth() >= 15) {
            inicio = hoje.withDayOfMonth(15);
            fim = hoje.plusMonths(1).withDayOfMonth(15);
        } else {
            inicio = hoje.minusMonths(1).withDayOfMonth(15);
            fim = hoje.withDayOfMonth(15);
        }

        return new PeriodoControle(
                inicio.atStartOfDay(),
                fim.atTime(LocalTime.MAX)
        );
    }

    private record PeriodoControle(
            LocalDateTime inicio,
            LocalDateTime fim) {
    }
}
