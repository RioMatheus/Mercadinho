import { useState } from "react";
import api from "../services/api";

export default function Login({ onLogin }) {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function fazerLogin(event) {
        event.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            const response = await api.post("/auth/login", { login, senha });
            onLogin(response.data);
        } catch (error) {
            setErro(error.response?.data?.message || error.message || "Nao foi possivel entrar.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-panel">
                <div className="login-copy">
                    <span className="brand-mark">M</span>
                    <h1>Mercadinho</h1>
                    <p>Controle simples para produtos, lotes, fornecedores e movimentacoes de estoque.</p>
                </div>

                <form className="login-form" onSubmit={fazerLogin}>
                    <span className="eyebrow">Acesso ao sistema</span>
                    <h2>Entrar</h2>

                    {erro && <div className="alert error">{erro}</div>}

                    <label>
                        Login
                        <input
                            autoFocus
                            value={login}
                            onChange={(event) => setLogin(event.target.value)}
                            placeholder="Digite seu usuario"
                            type="text"
                        />
                    </label>

                    <label>
                        Senha
                        <input
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite sua senha"
                            type="password"
                        />
                    </label>

                    <button className="button primary full" disabled={carregando} type="submit">
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </section>
        </main>
    );
}
