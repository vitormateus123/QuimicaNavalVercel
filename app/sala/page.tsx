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
      <header className="py-4 text-center shadow-sm" style={{ background: "rgba(25,118,210,0.92)" }}>
        <h1
          className="m-0 text-white"
          style={{ fontFamily: "'Kolker Brush', serif", fontSize: "clamp(40px,8vw,100px)", textShadow: "0 3px 3px white" }}
        >
          Química Naval
        </h1>
      </header>

      <div className="container mx-auto max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow">
          Bem-vindo, {nomeJogador}!
        </h2>

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erro}
          </div>
        )}

        {/* Criar sala */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">🚢 Nova Partida</h3>
          <button
            onClick={criarSala}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Sala"}
          </button>
        </div>

        {/* Entrar por ID */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">🔢 Entrar por ID da Sala</h3>
          <form onSubmit={entrarSalaManual} className="flex gap-3">
            <input
              type="number"
              value={idSalaManual}
              onChange={(e) => setIdSalaManual(e.target.value)}
              placeholder="ID da sala"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading || !idSalaManual}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Entrar
            </button>
          </form>
        </div>

        {/* Salas abertas */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">🎮 Salas Abertas</h3>
            <button
              onClick={carregarSalas}
              className="text-sm text-blue-600 hover:underline"
            >
              Atualizar
            </button>
          </div>
          {salas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma sala aberta no momento.</p>
          ) : (
            <ul className="divide-y">
              {salas.map((sala) => {
                const minhaSala = sala.id_jogador1 === Number(sessionStorage.getItem("idJogador"));
                return (
                  <li key={sala.id_jogada} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-medium">Sala #{sala.id_jogada}</span>
                      <span className="text-gray-500 ml-2">
                        — {sala.jogador1?.nome ?? "Desconhecido"}
                      </span>
                    </div>
                    {minhaSala ? (
                      <button
                        onClick={() => {
                          sessionStorage.setItem("idJogada", sala.id_jogada.toString());
                          router.push("/jogo");
                        }}
                        className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Retornar
                      </button>
                    ) : (
                      <button
                        onClick={() => entrarSala(sala.id_jogada)}
                        disabled={loading}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
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
