import { useEffect, useState } from "react";
import api from "../services/api";

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [nome, setNome] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregarCategorias() {
        try {
            setErro("");
            const response = await api.get("/categorias");
            setCategorias(response.data);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel carregar categorias.");
        }
    }

    useEffect(() => {
        carregarCategorias();
    }, []);

    function limparFormulario() {
        setNome("");
        setEditandoId(null);
    }

    async function salvarCategoria(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");

        try {
            if (editandoId) {
                await api.put(`/categorias/${editandoId}`, { nome });
                setMensagem("Categoria atualizada com sucesso.");
            } else {
                await api.post("/categorias", { nome });
                setMensagem("Categoria cadastrada com sucesso.");
            }

            limparFormulario();
            carregarCategorias();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel salvar a categoria.");
        }
    }

    function editarCategoria(categoria) {
        setEditandoId(categoria.id);
        setNome(categoria.nome);
    }

    async function excluirCategoria(id) {
        if (!window.confirm("Deseja excluir esta categoria?")) {
            return;
        }

        try {
            await api.delete(`/categorias/${id}`);
            setMensagem("Categoria excluida com sucesso.");
            carregarCategorias();
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel excluir a categoria.");
        }
    }

    return (
        <section className="content-section">
            <div className="section-header">
                <div>
                    <span className="eyebrow">Cadastro</span>
                    <h2>{editandoId ? "Editar categoria" : "Nova categoria"}</h2>
                </div>
                {editandoId && <button className="button ghost" onClick={limparFormulario} type="button">Cancelar edicao</button>}
            </div>

            {mensagem && <div className="alert success">{mensagem}</div>}
            {erro && <div className="alert error">{erro}</div>}

            <form className="form-grid compact-form" onSubmit={salvarCategoria}>
                <label>
                    Nome da categoria
                    <input
                        required
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        placeholder="Ex: Bebidas, Alimentos, Frutas"
                    />
                </label>
                <div className="form-actions">
                    <button className="button primary" type="submit">
                        {editandoId ? "Salvar alteracoes" : "Cadastrar categoria"}
                    </button>
                </div>
            </form>

            <div className="section-header">
                <div>
                    <span className="eyebrow">Lista</span>
                    <h2>Categorias cadastradas</h2>
                </div>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td><strong>{categoria.nome}</strong></td>
                                <td className="row-actions">
                                    <button className="button compact" onClick={() => editarCategoria(categoria)} type="button">Editar</button>
                                    <button className="button compact danger" onClick={() => excluirCategoria(categoria.id)} type="button">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categorias.length === 0 && <div className="empty-state">Nenhuma categoria cadastrada.</div>}
            </div>
        </section>
    );
}
