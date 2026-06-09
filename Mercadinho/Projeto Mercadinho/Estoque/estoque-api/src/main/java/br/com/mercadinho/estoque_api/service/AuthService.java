package br.com.mercadinho.estoque_api.service;

import br.com.mercadinho.estoque_api.dto.LoginRequest;
import br.com.mercadinho.estoque_api.dto.LoginResponse;
import br.com.mercadinho.estoque_api.entity.Usuario;
import br.com.mercadinho.estoque_api.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByLogin(request.getLogin())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        if (!usuario.getSenha().equals(request.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return LoginResponse.builder()
                .login(usuario.getLogin())
                .perfil(usuario.getPerfil())
                .mensagem("Login realizado com sucesso")
                .build();
    }
}