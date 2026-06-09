"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SalaAberta {
  id_jogada: number;
  id_jogador1: number;
  jogador1: { nome: string } | null;
  status: string;
}

export default function SalaPage() {
  const router = useRouter();
  const [nomeJogador, setNomeJogador] = useState("");
  const [salas, setSalas] = useState<SalaAberta[]>([]);
  const [idSalaManual, setIdSalaManual] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const nome = sessionStorage.getItem("nomeJogador");
    const idJogador = sessionStorage.getItem("idJogador");
    if (!nome || !idJogador) {
      router.push("/");
      return;
    }
    setNomeJogador(nome);
    carregarSalas();
    const interval = setInterval(carregarSalas, 5000);
    return () => clearInterval(interval);
  }, [router]);

  async function carregarSalas() {
    const res = await fetch("/api/partida");
    if (res.ok) {
      const data = await res.json();
      setSalas(data);
    }
  }

  async function criarSala() {
    setLoading(true);
    setErro("");
    const idJogador = sessionStorage.getItem("idJogador");
    const res = await fetch("/api/partida", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idJogador: Number(idJogador) }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErro(data.error);
      setLoading(false);
      return;
    }
    sessionStorage.setItem("idJogada", data.id_jogada);
    router.push("/jogo");
  }

  async function entrarSala(idJogada: number) {
    setLoading(true);
    setErro("");
    const idJogador = sessionStorage.getItem("idJogador");
    const res = await fetch("/api/partida/entrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idJogador: Number(idJogador), idJogada }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErro(data.error);
      setLoading(false);
      return;
    }
    sessionStorage.setItem("idJogada", idJogada.toString());
    router.push("/jogo");
  }

  async function entrarSalaManual(e: React.FormEvent) {
    e.preventDefault();
    if (!idSalaManual) return;
    await entrarSala(Number(idSalaManual));
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="site-header py-4 text-center sticky top-0 z-20">
        <h1 className="site-title m-0 leading-none" style={{ fontSize: "clamp(32px,6vw,72px)" }}>
          Química Naval
        </h1>
        <p className="header-subtitle mt-1">Seleção de Batalha</p>
      </header>

      <div className="container mx-auto max-w-2xl p-6">
        {/* Welcome */}
        <div className="text-center mb-6">
          <h2 style={{ fontFamily: "'Exo 2',sans-serif", fontWeight: 300, fontSize: "1.1rem", color: "rgba(200,230,255,0.7)" }}>
            Bem-vindo,{" "}
            <span style={{ fontWeight: 700, color: "var(--biolum)" }}>{nomeJogador}</span>
          </h2>
        </div>

        {erro && (
          <div className="error-banner rounded-lg mb-4">⚠ {erro}</div>
        )}

        {/* Criar sala */}
        <div className="glass-card p-6 mb-4">
          <h3 className="section-title">🚢 Nova Batalha</h3>
          <button
            onClick={criarSala}
            disabled={loading}
            className="btn btn-success"
            style={{ width: "100%", padding: "13px 0", fontSize: "1rem" }}
          >
            {loading ? "⏳ Criando..." : "⚓ Criar Sala"}
          </button>
        </div>

        {/* Entrar por ID */}
        <div className="glass-card p-6 mb-4">
          <h3 className="section-title">🔢 Entrar por Código da Sala</h3>
          <form onSubmit={entrarSalaManual} style={{ display: "flex", gap: 10 }}>
            <input
              type="number"
              value={idSalaManual}
              onChange={(e) => setIdSalaManual(e.target.value)}
              placeholder="Código da sala..."
              className="input-field"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={loading || !idSalaManual}
              className="btn btn-primary"
              style={{ padding: "8px 20px", whiteSpace: "nowrap" }}
            >
              Entrar
            </button>
          </form>
        </div>

        {/* Salas abertas */}
        <div className="glass-card p-6">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>🎮 Salas Abertas</h3>
            <button
              onClick={carregarSalas}
              style={{ background: "none", border: "none", color: "var(--biolum)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Exo 2',sans-serif", fontWeight: 600, letterSpacing: "0.05em" }}
            >
              ↻ Atualizar
            </button>
          </div>

          {salas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(180,210,255,0.4)", fontSize: "0.9rem" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌊</div>
              Nenhuma sala disponível no momento.
            </div>
          ) : (
            <ul style={{ listStyle: "none" }}>
              {salas.map((sala) => {
                const minhaSala = sala.id_jogador1 === Number(sessionStorage.getItem("idJogador"));
                return (
                  <li key={sala.id_jogada} className="sala-item">
                    <div>
                      <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, color: "var(--biolum)", fontSize: "0.85rem" }}>
                        #{sala.id_jogada}
                      </span>
                      <span className="text-dim" style={{ marginLeft: 8, fontSize: "0.85rem" }}>
                        — {sala.jogador1?.nome ?? "Desconhecido"}
                      </span>
                    </div>
                    {minhaSala ? (
                      <button
                        onClick={() => {
                          sessionStorage.setItem("idJogada", sala.id_jogada.toString());
                          router.push("/jogo");
                        }}
                        className="btn btn-gold"
                        style={{ padding: "5px 14px", fontSize: "0.8rem" }}
                      >
                        Retornar
                      </button>
                    ) : (
                      <button
                        onClick={() => entrarSala(sala.id_jogada)}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ padding: "5px 14px", fontSize: "0.8rem" }}
                      >
                        Entrar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
