package br.com.mercadinho.estoque_api.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class DashboardResponse {

    private Long totalProdutos;

    private Long produtosEstoqueBaixo;

    private Long produtosVencidos;

    private Long produtosProximosVencimento;

    private LocalDate periodoInicio;

    private LocalDate periodoFim;

    private BigDecimal valorEntrada;

    private BigDecimal valorSaidaVenda;

    private BigDecimal lucroPeriodo;

    private BigDecimal valorInvestido;

    private BigDecimal valorFaturado;

    private BigDecimal lucroEstimado;

    private BigDecimal perdas;

    private BigDecimal danos;

    private BigDecimal validade;

}
