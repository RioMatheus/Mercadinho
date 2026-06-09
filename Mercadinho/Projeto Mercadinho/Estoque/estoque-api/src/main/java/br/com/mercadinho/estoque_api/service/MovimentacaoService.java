package br.com.mercadinho.estoque_api.service;

import br.com.mercadinho.estoque_api.dto.MovimentacaoRequest;
import br.com.mercadinho.estoque_api.dto.ResumoMovimentacaoDTO;
import br.com.mercadinho.estoque_api.entity.Lote;
import br.com.mercadinho.estoque_api.entity.Movimentacao;
import br.com.mercadinho.estoque_api.entity.Produto;
import br.com.mercadinho.estoque_api.enums.MotivoSaida;
import br.com.mercadinho.estoque_api.enums.StatusEstoque;
import br.com.mercadinho.estoque_api.enums.TipoMovimentacao;
import br.com.mercadinho.estoque_api.repository.LoteRepository;
import br.com.mercadinho.estoque_api.repository.MovimentacaoRepository;
import br.com.mercadinho.estoque_api.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoService {

    private final ProdutoRepository produtoRepository;
    private final LoteRepository loteRepository;
    private final MovimentacaoRepository movimentacaoRepository;

    public MovimentacaoService(
            ProdutoRepository produtoRepository,
            LoteRepository loteRepository,
            MovimentacaoRepository movimentacaoRepository) {

        this.produtoRepository = produtoRepository;
        this.loteRepository = loteRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    public Movimentacao saida(MovimentacaoRequest request) {
        validarQuantidade(request.getQuantidade());

        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto nao encontrado"));

        Lote lote = loteRepository.findById(request.getLoteId())
                .orElseThrow(() -> new RuntimeException("Lote nao encontrado"));

        if (!lote.getProduto().getId().equals(produto.getId())) {
            throw new RuntimeException("Lote nao pertence ao produto informado");
        }

        if (lote.getQuantidade() < request.getQuantidade()) {
            throw new RuntimeException("Estoque do lote insuficiente");
        }

        if (produto.getQuantidade() < request.getQuantidade()) {
            throw new RuntimeException("Estoque do produto insuficiente");
        }

        produto.setQuantidade(produto.getQuantidade() - request.getQuantidade());
        lote.setQuantidade(lote.getQuantidade() - request.getQuantidade());

        atualizarStatus(produto);

        produtoRepository.save(produto);
        loteRepository.save(lote);

        Movimentacao movimentacao = Movimentacao.builder()
                .produto(produto)
                .lote(lote)
                .tipoMovimentacao(TipoMovimentacao.SAIDA)
                .motivoSaida(converterMotivoSaida(request.getMotivoSaida()))
                .quantidade(request.getQuantidade())
                .dataHora(LocalDateTime.now())
                .build();

        return movimentacaoRepository.save(movimentacao);
    }

    public List<Movimentacao> listarTodas() {
        return movimentacaoRepository.findAll();
    }

    public List<Movimentacao> listarPorProduto(Long produtoId) {
        return movimentacaoRepository.findByProdutoId(produtoId);
    }

    public ResumoMovimentacaoDTO resumoMovimentacoes() {
        List<Movimentacao> movimentacoes = movimentacaoRepository.findAll();

        long saidas = movimentacoes
                .stream()
                .filter(m -> m.getTipoMovimentacao() == TipoMovimentacao.SAIDA)
                .count();

        long vendas = contarPorMotivo(movimentacoes, MotivoSaida.VENDA);
        long danos = contarPorMotivo(movimentacoes, MotivoSaida.DANO);
        long perdas = contarPorMotivo(movimentacoes, MotivoSaida.PERDA);
        long validades = contarPorMotivo(movimentacoes, MotivoSaida.VALIDADE);

        return new ResumoMovimentacaoDTO(saidas, vendas, danos, perdas, validades);
    }

    private void atualizarStatus(Produto produto) {
        if (produto.getQuantidade() <= produto.getEstoqueMinimo()) {
            produto.setStatusEstoque(StatusEstoque.ESTOQUE_BAIXO);
        } else {
            produto.setStatusEstoque(StatusEstoque.NORMAL);
        }
    }

    private MotivoSaida converterMotivoSaida(String motivo) {
        if (motivo == null || motivo.isBlank()) {
            throw new RuntimeException("Motivo da saida e obrigatorio");
        }

        try {
            return MotivoSaida.valueOf(motivo.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Motivo de saida invalido");
        }
    }

    private void validarQuantidade(Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
    }

    private long contarPorMotivo(List<Movimentacao> movimentacoes, MotivoSaida motivo) {
        return movimentacoes
                .stream()
                .filter(m -> m.getTipoMovimentacao() == TipoMovimentacao.SAIDA)
                .filter(m -> m.getMotivoSaida() == motivo)
                .count();
    }
}
