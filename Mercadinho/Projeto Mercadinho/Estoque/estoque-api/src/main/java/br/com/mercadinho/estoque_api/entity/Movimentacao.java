package br.com.mercadinho.estoque_api.entity;

import br.com.mercadinho.estoque_api.enums.MotivoSaida;
import br.com.mercadinho.estoque_api.enums.TipoMovimentacao;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "lote_id")
    private br.com.mercadinho.estoque_api.entity.Lote lote;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipoMovimentacao;

    @Enumerated(EnumType.STRING)
    private MotivoSaida motivoSaida;

    private Integer quantidade;

    private LocalDateTime dataHora;
}
