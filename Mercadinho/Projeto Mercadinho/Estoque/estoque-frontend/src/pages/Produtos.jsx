import { useEffect, useState } from "react";
import api from "../services/api";
import { formatarCampoMoeda, formatarMoeda, moedaParaNumero } from "../utils/formatters";

const produtoVazio = {
    codigoBarras: "",
    nome: "",
    marca: "",
    categoria: "",
    descricao: "",
    unidadeMedida: "un",
    precoCompra: "",
    precoVenda: "",
    quantidade: "",
    estoqueMinimo: "",
    fornecedorId: ""
};

export default function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState(produtoVazio);
    const [editandoId, setEditandoId] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregarDados() {
        try {
            setErro("");
            const [produtosResponse, fornecedoresResponse, categoriasResponse] = await Promise.all([
                api.get("/produtos"),
                api.get("/fornecedores"),
                api.get("/categorias")
            ]);

            setProdutos(produtosResponse.data);
            setFornecedores(fornecedoresResponse.data);
            setCategorias(categoriasResponse.data);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel carregar os produtos.");
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function atualizarCampo(campo, valor) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    function limparFormulario() {
        setForm(produtoVazio);
        setEditandoId(null);
    }

    function prepararPayload() {
        return {
            codigoBarras: form.codigoBarras,
            nome: form.nome,
            marca: form.marca,
            categoria: form.categoria,
            descricao: form.descricao,
            unidadeMedida: form.unidadeMedida,
            precoCompra: moedaParaNumero(form.precoCompra),
            precoVenda: moedaParaNumero(form.precoVenda),
            quantidade: Number(form.quantidade),
            estoqueMinimo: Number(form.estoqueMinimo),
            fornecedor: form.fornecedorId ? { id: Number(form.fornecedorId) } : null
        };
    }

    async function salvarProduto(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");

        try {
            const payload = prepararPayload();

            if (editandoId) {
                await api.put(`/produtos/${editandoId}`, payload);
                setMensagem("Produto atualizado com sucesso.");
            } else {
                await api.post("/produtos", payload);
                setMensagem("Produto cadastrado com sucesso.");
            }

            limparFormulario();
            carregarDados();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel salvar o produto.");
        }
    }

    function editarProduto(produto) {
        setEditandoId(produto.id);
        setForm({
            codigoBarras: produto.codigoBarras || "",
            nome: produto.nome || "",
            marca: produto.marca || "",
            categoria: produto.categoria || "",
            descricao: produto.descricao || "",
            unidadeMedida: produto.unidadeMedida || "un",
            precoCompra: formatarCampoMoeda(String(Math.round(Number(produto.precoCompra || 0) * 100))),
            precoVenda: formatarCampoMoeda(String(Math.round(Number(produto.precoVenda || 0) * 100))),
            quantidade: produto.quantidade || "",
            estoqueMinimo: produto.estoqueMinimo || "",
            fornecedorId: produto.fornecedor?.id || ""
        });
    }

    async function excluirProduto(id) {
        if (!window.confirm("Deseja excluir este produto?")) {
            return;
        }

        try {
            await api.delete(`/produtos/${id}`);
            setMensagem("Produto excluido com sucesso.");
            carregarDados();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel excluir o produto.");
        }
    }

    return (
        <section className="content-section">
            <div className="section-header">
                <div>
                    <span className="eyebrow">Cadastro</span>
                    <h2>{editandoId ? "Editar produto" : "Novo produto"}</h2>
                </div>
                {editandoId && (
                    <button className="button ghost" onClick={limparFormulario} type="button">
                        Cancelar edicao
                    </button>
                )}
            </div>

            {mensagem && <div className="alert success">{mensagem}</div>}
            {erro && <div className="alert error">{erro}</div>}

            <form className="form-grid" onSubmit={salvarProduto}>
                <label>
                    Nome do produto
                    <input required value={form.nome} onChange={(event) => atualizarCampo("nome", event.target.value)} />
                </label>
                <label>
                    Marca
                    <input required value={form.marca} onChange={(event) => atualizarCampo("marca", event.target.value)} />
                </label>
                <label>
                    Categoria
                    <select required value={form.categoria} onChange={(event) => atualizarCampo("categoria", event.target.value)}>
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.nome}>{categoria.nome}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Codigo de barras
                    <input value={form.codigoBarras} onChange={(event) => atualizarCampo("codigoBarras", event.target.value)} />
                </label>
                <label>
                    Unidade
                    <select value={form.unidadeMedida} onChange={(event) => atualizarCampo("unidadeMedida", event.target.value)}>
                        <option value="un">Unidade</option>
                        <option value="kg">Quilo</option>
                        <option value="g">Grama</option>
                        <option value="l">Litro</option>
                        <option value="ml">Mililitro</option>
                        <option value="cx">Caixa</option>
                    </select>
                </label>
                <label>
                    Fornecedor
                    <select value={form.fornecedorId} onChange={(event) => atualizarCampo("fornecedorId", event.target.value)}>
                        <option value="">Sem fornecedor</option>
                        {fornecedores.map((fornecedor) => (
                            <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Preco de compra
                    <div className="money-input">
                        <span>R$</span>
                        <input
                            required
                            inputMode="numeric"
                            placeholder="0,00"
                            value={form.precoCompra}
                            onChange={(event) => atualizarCampo("precoCompra", formatarCampoMoeda(event.target.value))}
                        />
                    </div>
                </label>
                <label>
                    Preco de venda
                    <div className="money-input">
                        <span>R$</span>
                        <input
                            required
                            inputMode="numeric"
                            placeholder="0,00"
                            value={form.precoVenda}
                            onChange={(event) => atualizarCampo("precoVenda", formatarCampoMoeda(event.target.value))}
                        />
                    </div>
                </label>
                <label>
                    Quantidade
                    <input required min="0" step="1" type="number" value={form.quantidade} onChange={(event) => atualizarCampo("quantidade", event.target.value)} />
                </label>
                <label>
                    Estoque minimo
                    <input required min="0" step="1" type="number" value={form.estoqueMinimo} onChange={(event) => atualizarCampo("estoqueMinimo", event.target.value)} />
                </label>
                <label className="span-2">
                    Descricao
                    <textarea value={form.descricao} onChange={(event) => atualizarCampo("descricao", event.target.value)} />
                </label>

                <div className="form-actions">
                    <button className="button primary" type="submit">
                        {editandoId ? "Salvar alteracoes" : "Cadastrar produto"}
                    </button>
                </div>
            </form>

            <div className="section-header">
                <div>
                    <span className="eyebrow">Estoque</span>
                    <h2>Produtos cadastrados</h2>
                </div>
                <button className="button ghost" onClick={carregarDados} type="button">Atualizar lista</button>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Qtd.</th>
                            <th>Min.</th>
                            <th>Venda</th>
                            <th>Status</th>
                            <th>Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto) => (
                            <tr key={produto.id}>
                                <td>
                                    <strong>{produto.nome}</strong>
                                    <small>{produto.marca}</small>
                                </td>
                                <td>{produto.categoria}</td>
                                <td>{produto.quantidade}</td>
                                <td>{produto.estoqueMinimo}</td>
                                <td>{formatarMoeda(produto.precoVenda)}</td>
                                <td>
                                    <span className={produto.statusEstoque === "ESTOQUE_BAIXO" ? "status danger" : "status ok"}>
                                        {produto.statusEstoque === "ESTOQUE_BAIXO" ? "Baixo" : "Normal"}
                                    </span>
                                </td>
                                <td className="row-actions">
                                    <button className="button compact" onClick={() => editarProduto(produto)} type="button">Editar</button>
                                    <button className="button compact danger" onClick={() => excluirProduto(produto.id)} type="button">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {produtos.length === 0 && <div className="empty-state">Nenhum produto cadastrado.</div>}
            </div>
        </section>
    );
}
