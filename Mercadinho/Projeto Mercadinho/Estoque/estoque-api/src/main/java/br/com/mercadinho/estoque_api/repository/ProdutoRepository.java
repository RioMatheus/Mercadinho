package br.com.mercadinho.estoque_api.repository;

import br.com.mercadinho.estoque_api.entity.Produto;
import br.com.mercadinho.estoque_api.enums.StatusEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProdutoRepository
        extends JpaRepository<Produto, Long> {

    List<Produto> findByStatusEstoque(
            StatusEstoque statusEstoque);

    List<Produto> findByDataCadastroBetween(
            LocalDateTime inicio,
            LocalDateTime fim);

}
