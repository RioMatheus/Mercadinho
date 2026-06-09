import { useEffect, useState } from "react";
import api from "../services/api";

const loteVazio = {
    numeroLote: "",
    quantidade: "",
    dataFabricacao: "",
    dataValidade: "",
    produtoId: ""
};

export default function Lotes() {
    const [lotes, setLotes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState(loteVazio);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregarDados() {
        try {
            setErro("");
            const [lotesResponse, produtosResponse] = await Promise.all([
                api.get("/lotes"),
                api.get("/produtos")
            ]);
            setLotes(lotesResponse.data);
            setProdutos(produtosResponse.data);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel carregar os lotes.");
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function atualizarCampo(campo, valor) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    async function salvarLote(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");

        try {
            await api.post("/lotes", {
                numeroLote: form.numeroLote,
                quantidade: Number(form.quantidade),
                dataFabricacao: form.dataFabricacao,
                dataValidade: form.dataValidade,
                produto: { id: Number(form.produtoId) }
            });

            setForm(loteVazio);
            setMensagem("Lote cadastrado com sucesso.");
            carregarDados();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel salvar o lote.");
        }
    }

    async function excluirLote(id) {
        if (!window.confirm("Deseja excluir este lote?")) {
            return;
        }

        try {
            await api.delete(`/lotes/${id}`);
            setMensagem("Lote excluido com sucesso.");
            carregarDados();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel excluir o lote.");
        }
    }

    return (
        <section className="content-section">
            <div className="section-header">
                <div>
                    <span className="eyebrow">Cadastro</span>
                    <h2>Novo lote</h2>
                </div>
            </div>

            {mensagem && <div className="alert success">{mensagem}</div>}
            {erro && <div className="alert error">{erro}</div>}

            <form className="form-grid" onSubmit={salvarLote}>
                <label>
                    Produto
                    <select required value={form.produtoId} onChange={(event) => atualizarCampo("produtoId", event.target.value)}>
                        <option value="">Selecione um produto</option>
                        {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>{produto.nome}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Numero do lote
                    <input required value={form.numeroLote} onChange={(event) => atualizarCampo("numeroLote", event.target.value)} />
                </label>
                <label>
                    Quantidade
                    <input required min="0" step="1" type="number" value={form.quantidade} onChange={(event) => atualizarCampo("quantidade", event.target.value)} />
                </label>
                <label>
                    Fabricacao
                    <input type="date" value={form.dataFabricacao} onChange={(event) => atualizarCampo("dataFabricacao", event.target.value)} />
                </label>
                <label>
                    Validade
                    <input type="date" value={form.dataValidade} onChange={(event) => atualizarCampo("dataValidade", event.target.value)} />
                </label>
                <div className="form-actions">
                    <button className="button primary" type="submit">Cadastrar lote</button>
                </div>
            </form>

            <div className="section-header">
                <div>
                    <span className="eyebrow">Controle</span>
                    <h2>Lotes cadastrados</h2>
                </div>
                <button className="button ghost" onClick={carregarDados} type="button">Atualizar lista</button>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Lote</th>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Fabricacao</th>
                            <th>Validade</th>
                            <th>Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotes.map((lote) => (
                            <tr key={lote.id}>
                                <td><strong>{lote.numeroLote}</strong></td>
                                <td>{lote.produto?.nome || "-"}</td>
                                <td>{lote.quantidade}</td>
                                <td>{lote.dataFabricacao || "-"}</td>
                                <td>{lote.dataValidade || "-"}</td>
                                <td className="row-actions">
                                    <button className="button compact danger" onClick={() => excluirLote(lote.id)} type="button">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {lotes.length === 0 && <div className="empty-state">Nenhum lote cadastrado.</div>}
            </div>
        </section>
    );
}
