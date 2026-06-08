"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    // Se já tem sessão ativa, pula direto para a sala
    const nomeJogador = sessionStorage.getItem("nomeJogador");
    const idJogador = sessionStorage.getItem("idJogador");
    if (nomeJogador && idJogador) {
      router.push("/sala");
    }
  }, [router]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/jogador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Erro ao entrar");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("nomeJogador", data.nome);
      sessionStorage.setItem("idJogador", String(data.id_jogador));
      router.push("/sala");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)",
        padding: 20,
      }}
    >
      {/* Título */}
      <h1
        style={{
          fontFamily: "'Kolker Brush', serif",
          fontSize: "clamp(56px, 10vw, 120px)",
          color: "#fff",
          margin: "0 0 8px",
          textShadow: "0 4px 8px rgba(0,0,0,0.4)",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        Química Naval
      </h1>
      <p style={{ color: "#93c5fd", fontSize: 16, margin: "0 0 40px", textAlign: "center" }}>
        Descubra o elemento secreto do adversário!
      </p>

      {/* Card de login */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "36px 40px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#1e3a8a", textAlign: "center" }}>
          ⚗️ Entrar no Jogo
        </h2>

        <form onSubmit={entrar} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Seu nome de jogador
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Marie Curie"
              maxLength={30}
              autoFocus
              style={{
                width: "100%",
                border: "2px solid #d1d5db",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1d4ed8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
            />
          </div>

          {erro && (
            <div style={{
              background: "#fee2e2", border: "1px solid #fca5a5",
              borderRadius: 8, padding: "10px 14px", color: "#991b1b", fontSize: 13,
            }}>
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !nome.trim()}
            style={{
              background: loading || !nome.trim() ? "#e5e7eb" : "linear-gradient(135deg, #1d4ed8, #1e40af)",
              color: loading || !nome.trim() ? "#9ca3af" : "#fff",
              border: "none",
              borderRadius: 10,
              padding: "13px 0",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !nome.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              marginTop: 4,
            }}
          >
            {loading ? "Entrando..." : "🚀 Jogar Agora"}
          </button>
        </form>
      </div>

      <p style={{ color: "#93c5fd", fontSize: 12, marginTop: 24, textAlign: "center" }}>
        Jogo educativo de química · Tabela Periódica
      </p>
    </div>
  );
}
