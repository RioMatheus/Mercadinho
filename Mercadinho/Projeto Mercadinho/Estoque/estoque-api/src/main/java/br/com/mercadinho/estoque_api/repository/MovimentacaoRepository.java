package br.com.mercadinho.estoque_api.repository;

import br.com.mercadinho.estoque_api.entity.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    List<Movimentacao> findByProdutoId(Long produtoId);

    List<Movimentacao> findByDataHoraBetween(
            LocalDateTime inicio,
            LocalDateTime fim);
}
