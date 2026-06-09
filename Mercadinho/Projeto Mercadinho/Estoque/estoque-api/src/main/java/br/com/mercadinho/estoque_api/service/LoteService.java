package br.com.mercadinho.estoque_api.service;

import br.com.mercadinho.estoque_api.entity.Lote;
import br.com.mercadinho.estoque_api.repository.LoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoteService {

    private final LoteRepository loteRepository;

    public LoteService(LoteRepository loteRepository) {
        this.loteRepository = loteRepository;
    }

    public Lote salvar(Lote lote) {
        return loteRepository.save(lote);
    }

    public List<Lote> listarTodos() {
        return loteRepository.findAll();
    }

    public Lote buscarPorId(Long id) {
        return loteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lote não encontrado"));
    }

    public void excluir(Long id) {
        loteRepository.deleteById(id);
    }
}