package br.com.mercadinho.estoque_api.dto;

import br.com.mercadinho.estoque_api.enums.PerfilUsuario;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String login;
    private PerfilUsuario perfil;
    private String mensagem;
}