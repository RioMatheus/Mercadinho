package br.com.mercadinho.estoque_api.entity;

import br.com.mercadinho.estoque_api.enums.PerfilUsuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String login;

    private String senha;

    @Enumerated(EnumType.STRING)
    private PerfilUsuario perfil;
}