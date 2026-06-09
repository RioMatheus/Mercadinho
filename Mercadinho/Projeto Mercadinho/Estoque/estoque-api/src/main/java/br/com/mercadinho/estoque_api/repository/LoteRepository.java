package br.com.mercadinho.estoque_api.repository;

import br.com.mercadinho.estoque_api.entity.Lote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LoteRepository
        extends JpaRepository<Lote, Long> {

    List<Lote> findByDataValidadeBefore(
            LocalDate data);

    List<Lote> findByDataValidadeBetween(
            LocalDate inicio,
            LocalDate fim);
}