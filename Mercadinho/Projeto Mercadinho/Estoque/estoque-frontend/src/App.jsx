import { useState } from "react";

import Categorias from "./pages/Categorias";
import Dashboard from "./pages/Dashboard";
import Fornecedores from "./pages/Fornecedores";
import Login from "./pages/Login";
import Lotes from "./pages/Lotes";
import Movimentacoes from "./pages/Movimentacoes";
import Produtos from "./pages/Produtos";

const telas = [
    { id: "dashboard", label: "Inicio", icon: "⌂" },
    { id: "produtos", label: "Produtos", icon: "□" },
    { id: "categorias", label: "Categorias", icon: "◫" },
    { id: "fornecedores", label: "Fornecedores", icon: "◇" },
    { id: "lotes", label: "Lotes", icon: "▣" },
    { id: "movimentacoes", label: "Movimentacoes", icon: "↕" }
];

export default function App() {
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem("usuarioMercadinho");
        return salvo ? JSON.parse(salvo) : null;
    });
    const [telaAtual, setTelaAtual] = useState("dashboard");

    function entrar(usuarioLogado) {
        localStorage.setItem("usuarioMercadinho", JSON.stringify(usuarioLogado));
        setUsuario(usuarioLogado);
    }

    function sair() {
        localStorage.removeItem("usuarioMercadinho");
        setUsuario(null);
        setTelaAtual("dashboard");
    }

    if (!usuario) {
        return <Login onLogin={entrar} />;
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-mark">M</span>
                    <div>
                        <strong>Mercadinho</strong>
                        <small>Controle de estoque</small>
                    </div>
                </div>

                <nav className="nav-menu">
                    {telas.map((tela) => (
                        <button
                            key={tela.id}
                            className={telaAtual === tela.id ? "nav-item active" : "nav-item"}
                            onClick={() => setTelaAtual(tela.id)}
                            type="button"
                        >
                            <span aria-hidden="true">{tela.icon}</span>
                            {tela.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div>
                        <span className="eyebrow">Sistema do mercadinho</span>
                        <h1>{telas.find((tela) => tela.id === telaAtual)?.label}</h1>
                    </div>

                    <div className="user-box">
                        <div>
                            <strong>{usuario.login}</strong>
                            <small>{usuario.perfil}</small>
                        </div>
                        <button className="button ghost" onClick={sair} type="button">
                            Sair
                        </button>
                    </div>
                </header>

                {telaAtual === "dashboard" && <Dashboard irPara={setTelaAtual} usuario={usuario} />}
                {telaAtual === "produtos" && <Produtos />}
                {telaAtual === "categorias" && <Categorias />}
                {telaAtual === "fornecedores" && <Fornecedores />}
                {telaAtual === "lotes" && <Lotes />}
                {telaAtual === "movimentacoes" && <Movimentacoes />}
            </main>
        </div>
    );
}
