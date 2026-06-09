package br.com.mercadinho.estoque_api.entity;

import br.com.mercadinho.estoque_api.enums.StatusEstoque;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigoBarras;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String categoria;

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false)
    private String unidadeMedida;

    @Column(nullable = false)
    private BigDecimal precoCompra;

    @Column(nullable = false)
    private BigDecimal precoVenda;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private Integer estoqueMinimo;

    @ManyToOne
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @Enumerated(EnumType.STRING)
    private StatusEstoque statusEstoque;

    private LocalDateTime dataCadastro;

    @PrePersist
    public void aoCadastrar() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
    }
}
