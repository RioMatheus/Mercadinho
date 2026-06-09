package br.com.mercadinho.estoque_api.repository;

import br.com.mercadinho.estoque_api.entity.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornecedorRepository
        extends JpaRepository<Fornecedor, Long> {
}