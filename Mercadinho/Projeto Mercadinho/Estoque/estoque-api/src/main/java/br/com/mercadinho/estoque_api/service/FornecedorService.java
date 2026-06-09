package br.com.mercadinho.estoque_api.service;

import br.com.mercadinho.estoque_api.entity.Fornecedor;
import br.com.mercadinho.estoque_api.repository.FornecedorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;

    public FornecedorService(
            FornecedorRepository fornecedorRepository) {

        this.fornecedorRepository = fornecedorRepository;
    }

    public Fornecedor salvar(
            Fornecedor fornecedor) {

        return fornecedorRepository.save(
                fornecedor
        );
    }

    public List<Fornecedor> listarTodos() {

        return fornecedorRepository.findAll();
    }

    public Fornecedor buscarPorId(
            Long id) {

        return fornecedorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fornecedor não encontrado"
                        ));
    }

    public Fornecedor atualizar(
            Long id,
            Fornecedor fornecedorAtualizado) {

        Fornecedor fornecedor =
                buscarPorId(id);

        fornecedor.setNome(
                fornecedorAtualizado.getNome()
        );

        fornecedor.setCnpj(
                fornecedorAtualizado.getCnpj()
        );

        fornecedor.setTelefone(
                fornecedorAtualizado.getTelefone()
        );

        fornecedor.setEmail(
                fornecedorAtualizado.getEmail()
        );

        return fornecedorRepository.save(
                fornecedor
        );
    }

    public void excluir(Long id) {

        fornecedorRepository.deleteById(id);
    }
}