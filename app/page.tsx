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
      <header className="py-4 text-center shadow-sm" style={{ background: "rgba(25,118,210,0.92)" }}>
        <h1
          className="m-0 text-white"
          style={{ fontFamily: "'Kolker Brush', serif", fontSize: "clamp(60px,10vw,130px)", textShadow: "0 3px 3px white" }}
        >
          Química Naval
        </h1>
      </header>

      <div className="flex flex-1 items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-sm"
        >
          <fieldset>
            <legend className="text-center text-xl font-semibold mb-6">Bem-vindo</legend>
            <div className="mb-4">
              <label htmlFor="nome" className="block text-sm font-medium mb-1">
                Digite seu nome:
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                autoFocus
              />
            </div>
            {erro && <p className="text-red-600 text-sm mb-3">{erro}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
