import { useEffect, useState } from "react";
import api from "../services/api";
import { formatarMoeda } from "../utils/formatters";

export default function Dashboard({ irPara }) {
    const [dados, setDados] = useState(null);
    const [estoqueBaixo, setEstoqueBaixo] = useState([]);
    const [erro, setErro] = useState("");

    async function carregarDashboard() {
        try {
            setErro("");
            const [dashboardResponse, baixoResponse] = await Promise.all([
                api.get("/produtos/dashboard"),
                api.get("/produtos/estoque-baixo")
            ]);

            setDados(dashboardResponse.data);
            setEstoqueBaixo(baixoResponse.data);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel carregar o painel.");
        }
    }

    useEffect(() => {
        carregarDashboard();
    }, []);

    if (!dados) {
        return (
            <section className="content-section">
                <div className="empty-state">Carregando informacoes do estoque...</div>
            </section>
        );
    }

    return (
        <section className="content-section">
            {erro && <div className="alert error">{erro}</div>}

            <div className="stats-grid">
                <article className="metric-card">
                    <span>Total de produtos</span>
                    <strong>{dados.totalProdutos}</strong>
                    <small>Itens cadastrados</small>
                </article>
                <article className="metric-card warning">
                    <span>Estoque baixo</span>
                    <strong>{dados.produtosEstoqueBaixo}</strong>
                    <small>Precisam de atencao</small>
                </article>
                <article className="metric-card">
                    <span>Produtos vencidos</span>
                    <strong>{dados.produtosVencidos}</strong>
                    <small>Lotes fora da validade</small>
                </article>
                <article className="metric-card danger">
                    <span>Proximos ao vencimento</span>
                    <strong>{dados.produtosProximosVencimento}</strong>
                    <small>Vencem em ate 30 dias</small>
                </article>
                <article className="metric-card">
                    <span>Valor investido</span>
                    <strong>{formatarMoeda(dados.valorInvestido ?? dados.valorEntrada)}</strong>
                    <small>Compra do estoque atual</small>
                </article>
                <article className="metric-card">
                    <span>Valor faturado</span>
                    <strong>{formatarMoeda(dados.valorFaturado ?? dados.valorSaidaVenda)}</strong>
                    <small>Saidas por venda</small>
                </article>
                <article className="metric-card">
                    <span>Lucro estimado</span>
                    <strong>{formatarMoeda(dados.lucroEstimado ?? dados.lucroPeriodo)}</strong>
                    <small>Faturamento menos custos</small>
                </article>
                <article className="metric-card danger">
                    <span>Perdas</span>
                    <strong>{formatarMoeda(dados.perdas)}</strong>
                    <small>Saidas por perda</small>
                </article>
                <article className="metric-card danger">
                    <span>Danos</span>
                    <strong>{formatarMoeda(dados.danos)}</strong>
                    <small>Saidas por dano</small>
                </article>
                <article className="metric-card danger">
                    <span>Validade</span>
                    <strong>{formatarMoeda(dados.validade)}</strong>
                    <small>Saidas por vencimento</small>
                </article>
            </div>

            <div className="quick-actions">
                <button className="button primary" onClick={() => irPara("produtos")} type="button">
                    Cadastrar produto
                </button>
                <button className="button secondary" onClick={() => irPara("movimentacoes")} type="button">
                    Registrar movimentacao
                </button>
                <button className="button ghost" onClick={carregarDashboard} type="button">
                    Atualizar painel
                </button>
            </div>

            <div className="section-header">
                <div>
                    <span className="eyebrow">Atencao</span>
                    <h2>Produtos com estoque baixo</h2>
                </div>
            </div>

            {estoqueBaixo.length === 0 ? (
                <div className="empty-state">Nenhum produto em estoque baixo no momento.</div>
            ) : (
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Quantidade</th>
                                <th>Minimo</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estoqueBaixo.map((produto) => (
                                <tr key={produto.id}>
                                    <td>{produto.nome}</td>
                                    <td>{produto.categoria}</td>
                                    <td>{produto.quantidade}</td>
                                    <td>{produto.estoqueMinimo}</td>
                                    <td><span className="status danger">Estoque baixo</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
