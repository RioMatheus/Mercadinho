package br.com.mercadinho.estoque_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovimentacaoRequest {

    private Long produtoId;

    private Long loteId;

    private Integer quantidade;

    private String motivoSaida;
}
