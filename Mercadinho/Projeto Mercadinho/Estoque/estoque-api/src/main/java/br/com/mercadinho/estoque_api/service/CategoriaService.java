package br.com.mercadinho.estoque_api.service;

import br.com.mercadinho.estoque_api.entity.Categoria;
import br.com.mercadinho.estoque_api.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public Categoria salvar(Categoria categoria) {
        String nome = normalizarNome(categoria.getNome());
        if (categoriaRepository.existsByNomeIgnoreCase(nome)) {
            throw new RuntimeException("Categoria ja cadastrada");
        }

        categoria.setNome(nome);
        return categoriaRepository.save(categoria);
    }

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrada"));
    }

    public Categoria atualizar(Long id, Categoria categoriaAtualizada) {
        Categoria categoria = buscarPorId(id);
        String nome = normalizarNome(categoriaAtualizada.getNome());
        if (categoriaRepository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new RuntimeException("Categoria ja cadastrada");
        }

        categoria.setNome(nome);
        return categoriaRepository.save(categoria);
    }

    public void excluir(Long id) {
        categoriaRepository.deleteById(id);
    }

    private String normalizarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new RuntimeException("Nome da categoria e obrigatorio");
        }

        return nome.trim();
    }
}
