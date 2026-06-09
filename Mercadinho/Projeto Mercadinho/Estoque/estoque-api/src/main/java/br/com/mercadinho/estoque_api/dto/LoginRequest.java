package br.com.mercadinho.estoque_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String login;
    private String senha;
}