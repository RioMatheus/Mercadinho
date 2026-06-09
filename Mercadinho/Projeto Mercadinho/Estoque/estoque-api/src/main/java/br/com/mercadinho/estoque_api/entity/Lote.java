package br.com.mercadinho.estoque_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "lotes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroLote;

    private Integer quantidade;

    private LocalDate dataFabricacao;

    private LocalDate dataValidade;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;
}