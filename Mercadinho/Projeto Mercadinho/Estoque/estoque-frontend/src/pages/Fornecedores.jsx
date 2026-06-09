import { useEffect, useState } from "react";
import api from "../services/api";
import { apenasNumeros } from "../utils/formatters";

const fornecedorVazio = {
    nome: "",
    cnpj: "",
    telefone: "",
    email: ""
};

export default function Fornecedores() {
    const [fornecedores, setFornecedores] = useState([]);
    const [form, setForm] = useState(fornecedorVazio);
    const [editandoId, setEditandoId] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregarFornecedores() {
        try {
            setErro("");
            const response = await api.get("/fornecedores");
            setFornecedores(response.data);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel carregar fornecedores.");
        }
    }

    useEffect(() => {
        carregarFornecedores();
    }, []);

    function atualizarCampo(campo, valor) {
        setForm((atual) => ({ ...atual, [campo]: valor }));
    }

    function atualizarCampoNumerico(campo, valor, limite) {
        setForm((atual) => ({
            ...atual,
            [campo]: apenasNumeros(valor).slice(0, limite)
        }));
    }

    function limparFormulario() {
        setForm(fornecedorVazio);
        setEditandoId(null);
    }

    async function salvarFornecedor(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");

        try {
            if (editandoId) {
                await api.put(`/fornecedores/${editandoId}`, form);
                setMensagem("Fornecedor atualizado com sucesso.");
            } else {
                await api.post("/fornecedores", form);
                setMensagem("Fornecedor cadastrado com sucesso.");
            }

            limparFormulario();
            carregarFornecedores();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel salvar o fornecedor.");
        }
    }

    function editarFornecedor(fornecedor) {
        setEditandoId(fornecedor.id);
        setForm({
            nome: fornecedor.nome || "",
            cnpj: fornecedor.cnpj || "",
            telefone: fornecedor.telefone || "",
            email: fornecedor.email || ""
        });
    }

    async function excluirFornecedor(id) {
        if (!window.confirm("Deseja excluir este fornecedor?")) {
            return;
        }

        try {
            await api.delete(`/fornecedores/${id}`);
            setMensagem("Fornecedor excluido com sucesso.");
            carregarFornecedores();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel excluir o fornecedor.");
        }
    }

    return (
        <section className="content-section">
            <div className="section-header">
                <div>
                    <span className="eyebrow">Cadastro</span>
                    <h2>{editandoId ? "Editar fornecedor" : "Novo fornecedor"}</h2>
                </div>
                {editandoId && <button className="button ghost" onClick={limparFormulario} type="button">Cancelar edicao</button>}
            </div>

            {mensagem && <div className="alert success">{mensagem}</div>}
            {erro && <div className="alert error">{erro}</div>}

            <form className="form-grid" onSubmit={salvarFornecedor}>
                <label>
                    Nome
                    <input required value={form.nome} onChange={(event) => atualizarCampo("nome", event.target.value)} />
                </label>
                <label>
                    CNPJ
                    <input
                        inputMode="numeric"
                        maxLength="14"
                        pattern="\d{14}"
                        placeholder="Somente numeros"
                        title="Digite 14 numeros"
                        value={form.cnpj}
                        onChange={(event) => atualizarCampoNumerico("cnpj", event.target.value, 14)}
                    />
                </label>
                <label>
                    Telefone
                    <input
                        inputMode="numeric"
                        maxLength="11"
                        pattern="\d{11}"
                        placeholder="DDD + numero"
                        title="Digite 11 numeros, contando o DDD"
                        value={form.telefone}
                        onChange={(event) => atualizarCampoNumerico("telefone", event.target.value, 11)}
                    />
                </label>
                <label>
                    Email
                    <input type="email" value={form.email} onChange={(event) => atualizarCampo("email", event.target.value)} />
                </label>
                <div className="form-actions">
                    <button className="button primary" type="submit">
                        {editandoId ? "Salvar alteracoes" : "Cadastrar fornecedor"}
                    </button>
                </div>
            </form>

            <div className="section-header">
                <div>
                    <span className="eyebrow">Lista</span>
                    <h2>Fornecedores cadastrados</h2>
                </div>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CNPJ</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fornecedores.map((fornecedor) => (
                            <tr key={fornecedor.id}>
                                <td><strong>{fornecedor.nome}</strong></td>
                                <td>{fornecedor.cnpj || "-"}</td>
                                <td>{fornecedor.telefone || "-"}</td>
                                <td>{fornecedor.email || "-"}</td>
                                <td className="row-actions">
                                    <button className="button compact" onClick={() => editarFornecedor(fornecedor)} type="button">Editar</button>
                                    <button className="button compact danger" onClick={() => excluirFornecedor(fornecedor.id)} type="button">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {fornecedores.length === 0 && <div className="empty-state">Nenhum fornecedor cadastrado.</div>}
            </div>
        </section>
    );
}
