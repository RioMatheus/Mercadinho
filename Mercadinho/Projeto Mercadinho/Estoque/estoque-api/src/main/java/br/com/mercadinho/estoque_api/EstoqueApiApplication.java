package br.com.mercadinho.estoque_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import br.com.mercadinho.estoque_api.entity.Usuario;
import br.com.mercadinho.estoque_api.enums.PerfilUsuario;
import br.com.mercadinho.estoque_api.repository.UsuarioRepository;


@SpringBootApplication
public class EstoqueApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(EstoqueApiApplication.class, args);
	}

	@Bean
	public CommandLineRunner init(UsuarioRepository repo) {
		return args -> {

			if (repo.count() == 0) {

				repo.save(Usuario.builder()
						.login("admin")
						.senha("123456")
						.perfil(PerfilUsuario.ADMIN)
						.build());

				repo.save(Usuario.builder()
						.login("funcionario")
						.senha("123456")
						.perfil(PerfilUsuario.FUNCIONARIO)
						.build());
			}
		};
	}


}
