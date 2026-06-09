import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const movimentacaoVazia = {
    produtoId: "",
    loteId: "",
    quantidade: "",
    motivoSaida: "VENDA"
};

const motivosSaida = [
    { valor: "VENDA", label: "Venda" },
    { valor: "DANO", label: "Dano" },
    { valor: "PERDA", label: "Perda" },
    { valor: "VALIDADE", label: "Validade" }
];

export default function Movimentacoes() {
    const [produtos, setProdutos] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [resumo, setResumo] = useState(null);
    const [form, setForm] = useState(movimentacaoVazia);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    const lotesDisponiveis = useMemo(() => {
        if (!form.produtoId) {
            return lotes;
        }

        return lotes.filter((lote) => String(lote.produto?.id) === String(form.produtoId));
    }, [form.produtoId, lotes]);

    async function carregarDados() {
        try {
            setErro("");
            const [produtosResponse, lotesResponse, movimentacoesResponse, resumoResponse] = await Promise.all([
                api.get("/produtos"),
                api.get("/lotes"),
                api.get("/movimentacoes"),
                api.get("/movimentacoes/resumo")
            ]);

            setProdutos(produtosResponse.data);
            setLotes(lotesResponse.data);
            setMovimentacoes(movimentacoesResponse.data);
            setResumo(resumoResponse.data);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel carregar movimentacoes.");
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function atualizarCampo(campo, valor) {
        setForm((atual) => ({
            ...atual,
            [campo]: valor,
            ...(campo === "produtoId" ? { loteId: "" } : {})
        }));
    }

    async function registrarMovimentacao(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");

        try {
            await api.post("/movimentacoes/saida", {
                produtoId: Number(form.produtoId),
                loteId: Number(form.loteId),
                quantidade: Number(form.quantidade),
                motivoSaida: form.motivoSaida
            });

            setForm(movimentacaoVazia);
            setMensagem("Movimentacao registrada com sucesso.");
            carregarDados();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel registrar a movimentacao.");
        }
    }

    return (
        <section className="content-section">
            <div className="stats-grid two">
                <article className="metric-card">
                    <span>Vendas</span>
                    <strong>{resumo?.vendas ?? 0}</strong>
                    <small>Geram faturamento</small>
                </article>
                <article className="metric-card danger">
                    <span>Saidas registradas</span>
                    <strong>{resumo?.saidas ?? 0}</strong>
                    <small>Reduzem o estoque</small>
                </article>
            </div>

            <div className="section-header">
                <div>
                    <span className="eyebrow">Estoque</span>
                    <h2>Registrar movimentacao</h2>
                </div>
            </div>

            {mensagem && <div className="alert success">{mensagem}</div>}
            {erro && <div className="alert error">{erro}</div>}

            <form className="form-grid" onSubmit={registrarMovimentacao}>
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
                    Lote
                    <select required value={form.loteId} onChange={(event) => atualizarCampo("loteId", event.target.value)}>
                        <option value="">Selecione um lote</option>
                        {lotesDisponiveis.map((lote) => (
                            <option key={lote.id} value={lote.id}>
                                {lote.numeroLote} - qtd. {lote.quantidade}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Quantidade
                    <input required min="1" step="1" type="number" value={form.quantidade} onChange={(event) => atualizarCampo("quantidade", event.target.value)} />
                </label>
                <label>
                    Motivo da saida
                    <select required value={form.motivoSaida} onChange={(event) => atualizarCampo("motivoSaida", event.target.value)}>
                        {motivosSaida.map((motivo) => (
                            <option key={motivo.valor} value={motivo.valor}>{motivo.label}</option>
                        ))}
                    </select>
                </label>
                <div className="form-actions">
                    <button className="button primary" type="submit">Registrar saida</button>
                </div>
            </form>

            <div className="section-header">
                <div>
                    <span className="eyebrow">Historico</span>
                    <h2>Ultimas movimentacoes</h2>
                </div>
                <button className="button ghost" onClick={carregarDados} type="button">Atualizar lista</button>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Produto</th>
                            <th>Lote</th>
                            <th>Quantidade</th>
                            <th>Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimentacoes.map((movimentacao) => (
                            <tr key={movimentacao.id}>
                                <td>{movimentacao.dataHora ? new Date(movimentacao.dataHora).toLocaleString("pt-BR") : "-"}</td>
                                <td>
                                    <span className={movimentacao.tipoMovimentacao === "SAIDA" ? "status danger" : "status ok"}>
                                        {movimentacao.tipoMovimentacao}
                                    </span>
                                </td>
                                <td>{movimentacao.produto?.nome || "-"}</td>
                                <td>{movimentacao.lote?.numeroLote || "-"}</td>
                                <td>{movimentacao.quantidade}</td>
                                <td>{movimentacao.motivoSaida || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {movimentacoes.length === 0 && <div className="empty-state">Nenhuma movimentacao registrada.</div>}
            </div>
        </section>
    );
}
