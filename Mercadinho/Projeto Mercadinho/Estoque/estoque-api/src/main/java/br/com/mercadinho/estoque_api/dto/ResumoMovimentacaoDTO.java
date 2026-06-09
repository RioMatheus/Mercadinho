package br.com.mercadinho.estoque_api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResumoMovimentacaoDTO {

    private Long saidas;

    private Long vendas;

    private Long danos;

    private Long perdas;

    private Long validades;
}
