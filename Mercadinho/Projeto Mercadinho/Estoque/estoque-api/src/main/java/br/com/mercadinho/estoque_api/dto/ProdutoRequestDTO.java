package br.com.mercadinho.estoque_api.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProdutoRequestDTO {

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

    private Long fornecedorId;

}