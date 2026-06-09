package br.com.mercadinho.estoque_api.dto;

import br.com.mercadinho.estoque_api.enums.StatusEstoque;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProdutoResponseDTO {

    private Long id;

    private String codigoBarras;

    private String nome;

    private String marca;

    private String categoria;

    private String descricao;

    private String unidadeMedida;

    private BigDecimal precoCompra;

    private BigDecimal precoVenda;

    private Integer quantidade;

    private Integer estoqueMinimo;

    private StatusEstoque statusEstoque;

}