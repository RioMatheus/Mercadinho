package br.com.mercadinho.estoque_api.mapper;

import br.com.mercadinho.estoque_api.dto.ProdutoRequestDTO;
import br.com.mercadinho.estoque_api.dto.ProdutoResponseDTO;
import br.com.mercadinho.estoque_api.entity.Produto;

public class ProdutoMapper {

    public static Produto toEntity(
            ProdutoRequestDTO dto) {

        return Produto.builder()
                .codigoBarras(dto.getCodigoBarras())
                .nome(dto.getNome())
                .marca(dto.getMarca())
                .categoria(dto.getCategoria())
                .descricao(dto.getDescricao())
                .unidadeMedida(dto.getUnidadeMedida())
                .precoCompra(dto.getPrecoCompra())
                .precoVenda(dto.getPrecoVenda())
                .quantidade(dto.getQuantidade())
                .estoqueMinimo(dto.getEstoqueMinimo())
                .build();
    }

    public static ProdutoResponseDTO toDTO(
            Produto produto) {

        return ProdutoResponseDTO.builder()
                .id(produto.getId())
                .codigoBarras(produto.getCodigoBarras())
                .nome(produto.getNome())
                .marca(produto.getMarca())
                .categoria(produto.getCategoria())
                .descricao(produto.getDescricao())
                .unidadeMedida(produto.getUnidadeMedida())
                .precoCompra(produto.getPrecoCompra())
                .precoVenda(produto.getPrecoVenda())
                .quantidade(produto.getQuantidade())
                .estoqueMinimo(produto.getEstoqueMinimo())
                .statusEstoque(produto.getStatusEstoque())
                .build();
    }
}