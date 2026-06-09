"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setLoading(true);
    setErro("");

    const res = await fetch("/api/jogador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.trim() }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErro(data.error || "Erro ao criar jogador");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("idJogador", data.id_jogador);
    sessionStorage.setItem("nomeJogador", data.nome);
    router.push("/sala");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="site-header py-5 text-center sticky top-0 z-20">
        <h1 className="site-title m-0 leading-none">Química Naval</h1>
        <p className="header-subtitle mt-1 tracking-widest">Batalha de Elementos</p>
      </header>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="login-card">
          {/* Icon */}
          <div className="text-center mb-6">
            <span style={{ fontSize: 48, filter: "drop-shadow(0 0 12px rgba(0,229,255,0.6))" }}>⚗️</span>
            <h2 style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--biolum)", marginTop: 10, letterSpacing: "0.06em" }}>
              IDENTIFICAÇÃO
            </h2>
            <p className="text-dim" style={{ fontSize: "0.8rem", marginTop: 4 }}>Entre com seu nome de comandante</p>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="nome" style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "rgba(0,229,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                Código do Comandante
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-field"
                placeholder="Digite seu nome..."
                required
                autoFocus
              />
            </div>

            {erro && (
              <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginBottom: 12, padding: "6px 10px", background: "rgba(255,82,82,0.1)", borderRadius: 6, border: "1px solid rgba(255,82,82,0.25)" }}>
                ⚠ {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px 0", fontSize: "0.95rem", marginTop: 4 }}
            >
              {loading ? "⏳ Entrando..." : "🚢 Iniciar Missão"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
