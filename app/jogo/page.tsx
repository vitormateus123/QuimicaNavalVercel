"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Distribuição eletrônica → elemento ───────────────────────────────────────
// Mapeamento completo: distribuição eletrônica completa → id do elemento
const DIST_PARA_ELEMENTO: Record<string, number> = {
  // Período 1
  "1s1": 1,
  "1s2": 2,
  // Período 2
  "1s2 2s1": 3,
  "1s2 2s2": 4,
  "1s2 2s2 2p1": 5,
  "1s2 2s2 2p2": 6,
  "1s2 2s2 2p3": 7,
  "1s2 2s2 2p4": 8,
  "1s2 2s2 2p5": 9,
  "1s2 2s2 2p6": 10,
  // Período 3
  "1s2 2s2 2p6 3s1": 11,
  "1s2 2s2 2p6 3s2": 12,
  "1s2 2s2 2p6 3s2 3p1": 13,
  "1s2 2s2 2p6 3s2 3p2": 14,
  "1s2 2s2 2p6 3s2 3p3": 15,
  "1s2 2s2 2p6 3s2 3p4": 16,
  "1s2 2s2 2p6 3s2 3p5": 17,
  "1s2 2s2 2p6 3s2 3p6": 18,
  // Período 4
  "1s2 2s2 2p6 3s2 3p6 4s1": 19,
  "1s2 2s2 2p6 3s2 3p6 4s2": 20,
  "1s2 2s2 2p6 3s2 3p6 3d1 4s2": 21,
  "1s2 2s2 2p6 3s2 3p6 3d2 4s2": 22,
  "1s2 2s2 2p6 3s2 3p6 3d3 4s2": 23,
  "1s2 2s2 2p6 3s2 3p6 3d5 4s1": 24,
  "1s2 2s2 2p6 3s2 3p6 3d5 4s2": 25,
  "1s2 2s2 2p6 3s2 3p6 3d6 4s2": 26,
  "1s2 2s2 2p6 3s2 3p6 3d7 4s2": 27,
  "1s2 2s2 2p6 3s2 3p6 3d8 4s2": 28,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s1": 29,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2": 30,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p1": 31,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p2": 32,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p3": 33,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p4": 34,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p5": 35,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6": 36,
  // Período 5
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 5s1": 37,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 5s2": 38,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d1 5s2": 39,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d2 5s2": 40,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d4 5s1": 41,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d5 5s1": 42,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d5 5s2": 43,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d7 5s1": 44,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d8 5s1": 45,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10": 46,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s1": 47,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2": 48,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p1": 49,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p2": 50,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p3": 51,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p4": 52,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p5": 53,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6": 54,
  // Período 6
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 6s1": 55,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 6s2": 56,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d2 6s2": 72,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d3 6s2": 73,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d4 6s2": 74,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d5 6s2": 75,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d6 6s2": 76,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d7 6s2": 77,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d9 6s1": 78,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s1": 79,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2": 80,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p1": 81,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p2": 82,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p3": 83,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p4": 84,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p5": 85,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p6": 86,
  // Período 7
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p6 7s1": 87,
  "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p6 7s2": 88,
};

// Normaliza a distribuição: lowercase, remove espaços extras, ordena subníveis
function normalizarDistribuicao(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolverElemento(dist: string): number | null {
  const norm = normalizarDistribuicao(dist);
  return DIST_PARA_ELEMENTO[norm] ?? null;
}

// ── Dados dos elementos ───────────────────────────────────────────────────────
const ELEMENTO_NOME: Record<number, string> = {
  1:"Hidrogênio",2:"Hélio",3:"Lítio",4:"Berílio",5:"Boro",6:"Carbono",
  7:"Nitrogênio",8:"Oxigênio",9:"Flúor",10:"Neônio",11:"Sódio",12:"Magnésio",
  13:"Alumínio",14:"Silício",15:"Fósforo",16:"Enxofre",17:"Cloro",18:"Argônio",
  19:"Potássio",20:"Cálcio",21:"Escândio",22:"Titânio",23:"Vanádio",24:"Cromo",
  25:"Manganês",26:"Ferro",27:"Cobalto",28:"Níquel",29:"Cobre",30:"Zinco",
  31:"Gálio",32:"Germânio",33:"Arsênio",34:"Selênio",35:"Bromo",36:"Criptônio",
  37:"Rubídio",38:"Estrôncio",39:"Ítrio",40:"Zircônio",41:"Nióbio",42:"Molibdênio",
  43:"Tecnécio",44:"Rutênio",45:"Ródio",46:"Paládio",47:"Prata",48:"Cádmio",
  49:"Índio",50:"Estanho",51:"Antimônio",52:"Telúrio",53:"Iodo",54:"Xenônio",
  55:"Césio",56:"Bário",72:"Háfnio",73:"Tântalo",74:"Tungstênio",75:"Rênio",
  76:"Ósmio",77:"Irídio",78:"Platina",79:"Ouro",80:"Mercúrio",81:"Tálio",
  82:"Chumbo",83:"Bismuto",84:"Polônio",85:"Astato",86:"Radônio",87:"Frâncio",
  88:"Rádio",104:"Rutherfórdio",105:"Dúbnio",106:"Seabórgio",107:"Bóhrio",
  108:"Hássio",109:"Meitnério",110:"Darmstádio",111:"Roentgênio",112:"Copernício",
  113:"Nihônio",114:"Fleróvio",115:"Moscóvio",116:"Livermório",117:"Tenessino",
  118:"Oganessônio",
};

// ── Interfaces ────────────────────────────────────────────────────────────────
interface EstadoPartida {
  id_jogada: number;
  status: string;
  id_jogador1: number;
  id_jogador2: number | null;
  id_elemento1: number | null;
  id_elemento2: number | null;
  vencedor: number | null;
  vez_de: number | null;
  jogador1: { nome: string } | null;
  jogador2: { nome: string } | null;
  elemento1: { id_elemento: number; nome: string; familia: string } | null;
  elemento2: { id_elemento: number; nome: string; familia: string } | null;
  dicas_elemento1: { descricao: string }[];
  dicas_elemento2: { descricao: string }[];
}

type ModalTipo = "vitoria" | "derrota" | "acerto" | "erro" | "fim" | "reinicio" | null;

// ── Componente Modal ──────────────────────────────────────────────────────────
function Modal({ tipo, onClose, info }: { tipo: ModalTipo; onClose: () => void; info?: string }) {
  if (!tipo) return null;

  const configs: Record<NonNullable<ModalTipo>, { emoji: string; titulo: string; cor: string; bg: string }> = {
    vitoria: { emoji: "🏆", titulo: "Você Venceu!", cor: "#16a34a", bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)" },
    derrota: { emoji: "💀", titulo: "Derrota", cor: "#dc2626", bg: "linear-gradient(135deg,#fee2e2,#fecaca)" },
    acerto: { emoji: "✅", titulo: "Acertou!", cor: "#2563eb", bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)" },
    erro: { emoji: "❌", titulo: "Errou!", cor: "#d97706", bg: "linear-gradient(135deg,#fef3c7,#fde68a)" },
    fim: { emoji: "🎯", titulo: "Fim de Jogo!", cor: "#7c3aed", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)" },
    reinicio: { emoji: "🔄", titulo: "Reiniciando", cor: "#0891b2", bg: "linear-gradient(135deg,#cffafe,#a5f3fc)" },
  };
  const c = configs[tipo];

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: c.bg, borderRadius: 20, padding: "40px 48px",
          textAlign: "center", maxWidth: 420, width: "90%",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          border: `2px solid ${c.cor}40`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 12 }}>{c.emoji}</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: c.cor, margin: "0 0 8px" }}>{c.titulo}</h2>
        {info && <p style={{ color: "#374151", fontSize: 15, margin: "0 0 24px" }}>{info}</p>}
        <button
          onClick={onClose}
          style={{
            background: c.cor, color: "#fff", border: "none", borderRadius: 10,
            padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

// ── Componente Dicas Paginadas ─────────────────────────────────────────────────
function DicasPaginadas({ dicas }: { dicas: { descricao: string }[] }) {
  const [pagina, setPagina] = useState(0);
  const total = dicas.length;
  if (total === 0) return <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "20px 0" }}>Aguardando dicas...</p>;
  
  const dica = dicas[pagina];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        key={pagina}
        style={{
          background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 10,
          padding: "14px 16px", minHeight: 72, display: "flex", alignItems: "center",
          animation: "fadeIn 0.25s ease",
        }}
      >
        <div>
          <span style={{
            display: "inline-block", background: "#f59e0b", color: "#fff",
            borderRadius: 6, padding: "1px 7px", fontSize: 11, fontWeight: 700, marginBottom: 6,
          }}>
            #{pagina + 1}
          </span>
          <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.5 }}>{dica.descricao}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <button
          onClick={() => setPagina(p => Math.max(0, p - 1))}
          disabled={pagina === 0}
          style={{
            background: pagina === 0 ? "#e5e7eb" : "#1d4ed8", color: pagina === 0 ? "#9ca3af" : "#fff",
            border: "none", borderRadius: 8, width: 36, height: 36,
            cursor: pagina === 0 ? "not-allowed" : "pointer", fontSize: 16, fontWeight: 700,
            transition: "all 0.15s",
          }}
        >←</button>
        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
          Dica {pagina + 1} / {total}
        </span>
        <button
          onClick={() => setPagina(p => Math.min(total - 1, p + 1))}
          disabled={pagina === total - 1}
          style={{
            background: pagina === total - 1 ? "#e5e7eb" : "#1d4ed8",
            color: pagina === total - 1 ? "#9ca3af" : "#fff",
            border: "none", borderRadius: 8, width: 36, height: 36,
            cursor: pagina === total - 1 ? "not-allowed" : "pointer", fontSize: 16, fontWeight: 700,
            transition: "all 0.15s",
          }}
        >→</button>
      </div>
    </div>
  );
}

// ── Componente Principal ──────────────────────────────────────────────────────
export default function JogoPage() {
  const router = useRouter();

  // Estado principal
  const [estado, setEstado] = useState<EstadoPartida | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Distribuição eletrônica (fase de escolha)
  const [distInput, setDistInput] = useState("");
  const [distErro, setDistErro] = useState("");
  const [distOk, setDistOk] = useState(false);
  const [elementoResolvidoId, setElementoResolvidoId] = useState<number | null>(null);
  const [elementoResolvidoNome, setElementoResolvidoNome] = useState("");
  const [validando, setValidando] = useState(false);

  // Palpite (fase de adivinhação): distribuição do elemento adversário
  const [palpiteInput, setPalpiteInput] = useState("");
  const [palpiteErro, setPalpiteErro] = useState("");
  const [palpiteResolvidoId, setPalpiteResolvidoId] = useState<number | null>(null);
  const [palpiteResolvidoNome, setPalpiteResolvidoNome] = useState("");

  // Modal
  const [modal, setModal] = useState<{ tipo: ModalTipo; info?: string } | null>(null);
  const ultimoStatusRef = useRef<string>("");
  const ultimoVencedorRef = useRef<number | null | undefined>(undefined);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const idJogador = typeof window !== "undefined"
    ? Number(sessionStorage.getItem("idJogador") ?? "0") : 0;
  const idJogada = typeof window !== "undefined"
    ? Number(sessionStorage.getItem("idJogada") ?? "0") : 0;

  const carregarEstado = useCallback(async () => {
    const id = typeof window !== "undefined"
      ? Number(sessionStorage.getItem("idJogada") ?? "0") : 0;
    if (!id) return;
    try {
      const res = await fetch(`/api/partida/estado?idJogada=${id}`);
      if (!res.ok) return;
      const data: EstadoPartida = await res.json();
      setEstado(prev => {
        // Detecta mudanças de estado para exibir modais
        if (prev && data.status !== prev.status) {
          if (data.status === "finalizada") {
            const jogId = typeof window !== "undefined"
              ? Number(sessionStorage.getItem("idJogador") ?? "0") : 0;
            if (data.vencedor === jogId) {
              setModal({ tipo: "vitoria", info: "Você identificou o elemento secreto do adversário!" });
            } else {
              setModal({ tipo: "derrota", info: "O adversário descobriu seu elemento antes de você." });
            }
          }
        }
        return data;
      });
    } catch {
      // ignora
    }
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("idJogador") || !sessionStorage.getItem("idJogada")) {
      router.push("/");
      return;
    }
    carregarEstado();
    intervalRef.current = setInterval(carregarEstado, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [carregarEstado, router]);

  // ── Derivações ────────────────────────────────────────────────────────────
  const euJogador1 = estado?.id_jogador1 === idJogador;
  const meuElementoId = estado ? (euJogador1 ? estado.id_elemento1 : estado.id_elemento2) : null;
  const meuElemento = estado ? (euJogador1 ? estado.elemento1 : estado.elemento2) : null;
  const dicasAdversario: { descricao: string }[] = estado
    ? (euJogador1 ? estado.dicas_elemento2 : estado.dicas_elemento1) ?? [] : [];

  const finalizada = estado?.status === "finalizada";
  const adivinhando = estado?.status === "adivinhando";
  const emAndamento = estado?.status === "em_andamento";
  const jaEscolheu = meuElementoId !== null && meuElementoId !== undefined;
  const minhaVez = adivinhando && estado?.vez_de === idJogador;

  // ── Validar distribuição eletrônica em tempo real ─────────────────────────
  function handleDistChange(val: string) {
    setDistInput(val);
    setDistErro("");
    setDistOk(false);
    setElementoResolvidoId(null);
    setElementoResolvidoNome("");
    if (!val.trim()) return;
    const id = resolverElemento(val);
    if (id) {
      setDistOk(true);
      setElementoResolvidoId(id);
      setElementoResolvidoNome(ELEMENTO_NOME[id] ?? `Elemento #${id}`);
    }
  }

  // ── Validar palpite em tempo real ─────────────────────────────────────────
  function handlePalpiteChange(val: string) {
    setPalpiteInput(val);
    setPalpiteErro("");
    setPalpiteResolvidoId(null);
    setPalpiteResolvidoNome("");
    if (!val.trim()) return;
    const id = resolverElemento(val);
    if (id) {
      setPalpiteResolvidoId(id);
      setPalpiteResolvidoNome(ELEMENTO_NOME[id] ?? `Elemento #${id}`);
    }
  }

  // ── Confirmar elemento secreto ────────────────────────────────────────────
  async function confirmarDistribuicao() {
    if (!distOk || !elementoResolvidoId || jaEscolheu || enviando || !emAndamento) return;
    setDistErro("");
    setValidando(true);
    setEnviando(true);
    try {
      const res = await fetch("/api/elemento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idJogador, idJogada, idElemento: elementoResolvidoId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDistErro(data.error ?? "Erro ao confirmar elemento");
      } else {
        setDistInput("");
        setDistOk(false);
        setElementoResolvidoId(null);
        setElementoResolvidoNome("");
        await carregarEstado();
      }
    } catch {
      setDistErro("Erro de conexão");
    } finally {
      setEnviando(false);
      setValidando(false);
    }
  }

  // ── Enviar palpite ────────────────────────────────────────────────────────
  async function confirmarPalpite() {
    if (!palpiteResolvidoId || !minhaVez || enviando) return;
    setPalpiteErro("");
    setEnviando(true);
    try {
      const res = await fetch("/api/partida/palpite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idJogador, idJogada, idPalpite: palpiteResolvidoId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPalpiteErro(data.error ?? "Erro ao enviar palpite");
      } else {
        if (data.acertou) {
          setModal({ tipo: "vitoria", info: `Você acertou! O elemento era ${palpiteResolvidoNome}.` });
        } else {
          setModal({ tipo: "erro", info: `${palpiteResolvidoNome} não é o elemento secreto. Vez do adversário!` });
        }
        setPalpiteInput("");
        setPalpiteResolvidoId(null);
        setPalpiteResolvidoNome("");
        await carregarEstado();
      }
    } catch {
      setPalpiteErro("Erro de conexão");
    } finally {
      setEnviando(false);
    }
  }

  // ── Status da partida ─────────────────────────────────────────────────────
  let statusLabel = "";
  let statusColor = "#6b7280";
  if (estado?.status === "aguardando") { statusLabel = "⏳ Aguardando adversário..."; statusColor = "#d97706"; }
  else if (emAndamento && !jaEscolheu) { statusLabel = "🧪 Defina seu elemento secreto"; statusColor = "#2563eb"; }
  else if (emAndamento && jaEscolheu) { statusLabel = "⏳ Aguardando adversário escolher"; statusColor = "#d97706"; }
  else if (adivinhando && minhaVez) { statusLabel = "🔍 Sua vez de adivinhar!"; statusColor = "#16a34a"; }
  else if (adivinhando && !minhaVez) { statusLabel = "⏳ Vez do adversário adivinhar"; statusColor = "#d97706"; }
  else if (finalizada) { statusLabel = "🏁 Partida finalizada"; statusColor = "#7c3aed"; }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn { from { opacity:0; transform:scale(0.85) } to { opacity:1; transform:scale(1) } }
        @keyframes slideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        * { box-sizing: border-box; }
        input:focus { outline: 2px solid #2563eb; outline-offset: 1px; }
        .btn-primary { transition: all 0.15s; }
        .btn-primary:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .card { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
      `}</style>

      {/* Modal de eventos */}
      <Modal tipo={modal?.tipo ?? null} info={modal?.info} onClose={() => setModal(null)} />

      <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header style={{
          background: "linear-gradient(135deg, #1e40af, #1d4ed8)",
          padding: "10px 20px", display: "flex", alignItems: "center",
          justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <h1 style={{
            fontFamily: "'Kolker Brush', serif",
            fontSize: "clamp(32px,5vw,60px)", color: "#fff",
            margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.3)", lineHeight: 1,
          }}>
            Química Naval
          </h1>
          <div style={{ textAlign: "right" }}>
            {estado && (
              <div style={{ color: "#bfdbfe", fontSize: 13 }}>
                Sala #{estado.id_jogada} — {estado.jogador1?.nome} vs {estado.jogador2?.nome ?? "..."}
              </div>
            )}
            <div style={{
              display: "inline-block", marginTop: 4,
              background: "rgba(255,255,255,0.15)", borderRadius: 20,
              padding: "2px 12px", color: "#fff", fontSize: 12, fontWeight: 600,
            }}>
              <span style={{ color: statusColor === "#6b7280" ? "#cbd5e1" : "#fde68a" }}>●</span>
              {" "}{statusLabel}
            </div>
          </div>
        </header>

        {erro && (
          <div style={{ background: "#fee2e2", borderBottom: "2px solid #f87171", color: "#991b1b", padding: "8px 20px", textAlign: "center", fontSize: 14 }}>
            {erro}
          </div>
        )}

        {/* Layout principal: 3 colunas em desktop */}
        <main style={{
          flex: 1, padding: "16px", display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,320px)",
          gridTemplateRows: "auto",
          gap: 14, maxWidth: 1400, margin: "0 auto", width: "100%",
          alignItems: "start",
        }}>

          {/* ── COLUNA 1: Definir elemento secreto / Enviar palpite ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Card: Distribuição Eletrônica */}
            {!finalizada && (
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#1e40af" }}>
                  {adivinhando ? "🔍 Enviar Palpite" : "🧪 Seu Elemento Secreto"}
                </h3>
                <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>
                  {adivinhando
                    ? "Informe a distribuição eletrônica completa do elemento que você acha que o adversário escolheu."
                    : "Informe a distribuição eletrônica completa do elemento que deseja usar como segredo."}
                </p>

                {/* Fase de escolha: já escolheu */}
                {emAndamento && jaEscolheu && meuElemento && (
                  <div style={{
                    background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10,
                    padding: "14px 16px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#15803d", fontSize: 15 }}>
                      {meuElemento.nome}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#166534" }}>{meuElemento.familia}</p>
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#4ade80" }}>Aguardando adversário...</p>
                  </div>
                )}

                {/* Fase de escolha: ainda não escolheu */}
                {emAndamento && !jaEscolheu && (
                  <>
                    <input
                      type="text"
                      value={distInput}
                      onChange={e => handleDistChange(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && confirmarDistribuicao()}
                      placeholder="Ex: 1s2 2s2 2p6 3s2 3p1"
                      style={{
                        width: "100%", border: `2px solid ${distOk ? "#16a34a" : distErro ? "#dc2626" : "#d1d5db"}`,
                        borderRadius: 8, padding: "10px 12px", fontSize: 14,
                        background: distOk ? "#f0fdf4" : "#fff", transition: "border-color 0.2s",
                      }}
                    />
                    {distOk && elementoResolvidoNome && (
                      <div style={{
                        marginTop: 8, background: "#f0fdf4", border: "1px solid #86efac",
                        borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
                        animation: "slideIn 0.2s ease",
                      }}>
                        <span style={{ fontSize: 18 }}>⚗️</span>
                        <div>
                          <div style={{ fontWeight: 700, color: "#15803d", fontSize: 14 }}>{elementoResolvidoNome}</div>
                          <div style={{ fontSize: 11, color: "#4ade80" }}>Elemento identificado!</div>
                        </div>
                      </div>
                    )}
                    {distErro && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{distErro}</p>}
                    {distInput && !distOk && !distErro && (
                      <p style={{ color: "#d97706", fontSize: 12, marginTop: 6 }}>
                        Distribuição não reconhecida. Verifique o formato.
                      </p>
                    )}
                    <button
                      className="btn-primary"
                      onClick={confirmarDistribuicao}
                      disabled={!distOk || enviando}
                      style={{
                        width: "100%", marginTop: 12, background: "#16a34a", color: "#fff",
                        border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14,
                        fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {validando ? "Confirmando..." : "✅ Confirmar Elemento Secreto"}
                    </button>
                  </>
                )}

                {/* Fase de adivinhação */}
                {adivinhando && (
                  <>
                    {meuElemento && (
                      <div style={{
                        background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
                        padding: "10px 12px", marginBottom: 12,
                      }}>
                        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Seu elemento secreto:</p>
                        <p style={{ margin: "2px 0 0", fontWeight: 700, color: "#1e40af", fontSize: 14 }}>
                          {meuElemento.nome} — <span style={{ fontWeight: 400, fontSize: 12 }}>{meuElemento.familia}</span>
                        </p>
                      </div>
                    )}
                    <input
                      type="text"
                      value={palpiteInput}
                      onChange={e => handlePalpiteChange(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && confirmarPalpite()}
                      placeholder="Distribuição do elemento adversário"
                      disabled={!minhaVez}
                      style={{
                        width: "100%",
                        border: `2px solid ${palpiteResolvidoId ? "#7c3aed" : palpiteErro ? "#dc2626" : "#d1d5db"}`,
                        borderRadius: 8, padding: "10px 12px", fontSize: 14,
                        background: !minhaVez ? "#f9fafb" : palpiteResolvidoId ? "#faf5ff" : "#fff",
                        transition: "border-color 0.2s",
                      }}
                    />
                    {palpiteResolvidoNome && (
                      <div style={{
                        marginTop: 8, background: "#faf5ff", border: "1px solid #c4b5fd",
                        borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
                        animation: "slideIn 0.2s ease",
                      }}>
                        <span style={{ fontSize: 18 }}>🔬</span>
                        <div>
                          <div style={{ fontWeight: 700, color: "#6d28d9", fontSize: 14 }}>{palpiteResolvidoNome}</div>
                          <div style={{ fontSize: 11, color: "#8b5cf6" }}>Elemento identificado</div>
                        </div>
                      </div>
                    )}
                    {palpiteErro && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 6 }}>{palpiteErro}</p>}
                    <button
                      className="btn-primary"
                      onClick={confirmarPalpite}
                      disabled={!palpiteResolvidoId || !minhaVez || enviando}
                      style={{
                        width: "100%", marginTop: 12,
                        background: minhaVez ? "#7c3aed" : "#e5e7eb",
                        color: minhaVez ? "#fff" : "#9ca3af",
                        border: "none", borderRadius: 8, padding: "11px 0",
                        fontSize: 14, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {enviando ? "Enviando..." : minhaVez ? "🎯 Enviar Palpite" : "⏳ Vez do Adversário"}
                    </button>
                  </>
                )}

                {/* Resultado final inline */}
                {finalizada && (
                  <div style={{
                    background: estado?.vencedor === idJogador ? "#dcfce7" : "#fee2e2",
                    border: `1px solid ${estado?.vencedor === idJogador ? "#86efac" : "#fca5a5"}`,
                    borderRadius: 10, padding: "16px", textAlign: "center",
                  }}>
                    <p style={{
                      fontWeight: 800, fontSize: 16, margin: "0 0 6px",
                      color: estado?.vencedor === idJogador ? "#15803d" : "#dc2626",
                    }}>
                      {estado?.vencedor === idJogador ? "🏆 Você venceu!" : "💀 Você perdeu!"}
                    </p>
                    <button
                      onClick={() => router.push("/sala")}
                      style={{
                        background: "#1d4ed8", color: "#fff", border: "none",
                        borderRadius: 8, padding: "9px 24px", fontSize: 14,
                        fontWeight: 700, cursor: "pointer", marginTop: 8,
                      }}
                    >
                      Jogar Novamente
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Card: Status dos jogadores */}
            {(emAndamento || estado?.status === "aguardando") && (
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#374151" }}>👥 Status dos Jogadores</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { nome: estado?.jogador1?.nome, temElemento: !!estado?.id_elemento1, cor: "#1e40af" },
                    { nome: estado?.jogador2?.nome ?? "Aguardando...", temElemento: !!estado?.id_elemento2, cor: "#166534" },
                  ].map((j, i) => (
                    <div key={i} style={{
                      flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb",
                      borderRadius: 10, padding: "12px", textAlign: "center",
                    }}>
                      <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: j.cor }}>{j.nome}</p>
                      <div style={{ fontSize: 22 }}>{j.temElemento ? "✅" : "⏳"}</div>
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6b7280" }}>
                        {j.temElemento ? "Pronto" : "Escolhendo..."}
                      </p>
                    </div>
                  ))}
                </div>
                {estado?.status === "aguardando" && (
                  <div style={{
                    marginTop: 12, background: "#eff6ff", border: "1px solid #bfdbfe",
                    borderRadius: 8, padding: "10px 14px", textAlign: "center",
                  }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>ID da Sala:</p>
                    <p style={{ margin: "2px 0 0", fontSize: 28, fontWeight: 900, color: "#1d4ed8" }}>
                      {estado.id_jogada}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#93c5fd" }}>
                      Compartilhe com o adversário
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── COLUNA 2: Dicas do adversário + Turno ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(adivinhando || finalizada) && (
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#374151" }}>
                  💡 Dicas do Elemento Adversário
                </h3>
                <DicasPaginadas dicas={dicasAdversario} />
              </div>
            )}

            {adivinhando && (
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#374151" }}>⚔️ Turno Atual</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { nome: estado?.jogador1?.nome, id: estado?.id_jogador1, cor: "#1e40af" },
                    { nome: estado?.jogador2?.nome, id: estado?.id_jogador2, cor: "#166534" },
                  ].map((j, i) => {
                    const vez = estado?.vez_de === j.id;
                    return (
                      <div key={i} style={{
                        flex: 1, borderRadius: 10, padding: "12px", textAlign: "center",
                        background: vez ? (j.cor === "#1e40af" ? "#eff6ff" : "#f0fdf4") : "#f9fafb",
                        border: `2px solid ${vez ? j.cor : "#e5e7eb"}`,
                        transition: "all 0.2s",
                      }}>
                        <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 12, color: j.cor }}>{j.nome}</p>
                        <div style={{ fontSize: 20 }}>{vez ? "🎯" : "⏳"}</div>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: vez ? j.cor : "#9ca3af", fontWeight: vez ? 700 : 400 }}>
                          {vez ? "Jogando agora" : "Aguardando"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Revelação final */}
            {finalizada && estado && (
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#374151" }}>📋 Elementos Revelados</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { nome: estado.jogador1?.nome, el: estado.elemento1, cor: "#1e40af" },
                    { nome: estado.jogador2?.nome, el: estado.elemento2, cor: "#166534" },
                  ].map((j, i) => (
                    <div key={i} style={{
                      flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb",
                      borderRadius: 10, padding: "12px", textAlign: "center",
                    }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 12, color: j.cor }}>{j.nome}</p>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#111827" }}>{j.el?.nome ?? "?"}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>{j.el?.familia}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push("/sala")}
                  style={{
                    width: "100%", marginTop: 14, background: "#1d4ed8", color: "#fff",
                    border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14,
                    fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s",
                  }}
                >
                  🔄 Jogar Novamente
                </button>
              </div>
            )}
          </div>

          {/* ── COLUNA 3: Tabela Periódica (referência visual) ── */}
          <div className="card" style={{ padding: 14, overflow: "auto" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#374151", textAlign: "center" }}>
              📊 Tabela Periódica (Referência)
            </h3>
            <div style={{ overflowX: "auto" }}>
              <TabelaPeriodicaMini />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// ── Tabela periódica compacta (apenas visual, sem interação) ─────────────────
function TabelaPeriodicaMini() {
  return (
    <table style={{ borderCollapse: "separate", borderSpacing: 2, fontSize: 9 }}>
      <tbody>
        {ROWS_MINI.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => {
              if (!cell) return <td key={ci} style={{ width: 28, height: 26 }} />;
              if ("type" in cell) {
                if (cell.type === "period") return (
                  <td key={ci} style={{ width: 20, textAlign: "right", color: "#6b7280", fontSize: 9, paddingRight: 2 }}>
                    {cell.num}
                  </td>
                );
                return <td key={ci} style={{ width: 28 }} />;
              }
              return (
                <td key={ci} style={{
                  width: 28, height: 26, border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: 3, textAlign: "center", cursor: "default",
                  background: CLASSE_COR[cell.cls] ?? "#e5e7eb",
                  boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.15)",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 9, lineHeight: 1 }}>{cell.symbol}</div>
                  <div style={{ fontSize: 7, color: "#374151", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{cell.id}</div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const CLASSE_COR: Record<string, string> = {
  "nao-metais": "#B5D6A7",
  "metais-alcalinos": "#F9E79F",
  "metais-alcalino-terrosos": "#FAD7A0",
  "semimetais": "#AED6F1",
  "halogenios": "#A3E4D7",
  "gases-nobres": "#85C1E9",
  "outros-metais": "#D5DBDB",
  "metais-de-transicao": "#F5B7B1",
};

// Versão compacta da tabela (mesmos dados mas sem necessidade de interação)
const ROWS_MINI: Array<Array<null | { type: "period"; num: number } | { id: number; symbol: string; cls: string }>> = [
  [
    { type: "period", num: 1 },
    { id:1, symbol:"H", cls:"nao-metais" },
    null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
    { id:2, symbol:"He", cls:"gases-nobres" },
  ],
  [
    { type:"period", num:2 },
    { id:3, symbol:"Li", cls:"metais-alcalinos" },
    { id:4, symbol:"Be", cls:"metais-alcalino-terrosos" },
    null,null,null,null,null,null,null,null,null,null,
    { id:5, symbol:"B", cls:"semimetais" },
    { id:6, symbol:"C", cls:"nao-metais" },
    { id:7, symbol:"N", cls:"nao-metais" },
    { id:8, symbol:"O", cls:"nao-metais" },
    { id:9, symbol:"F", cls:"halogenios" },
    { id:10, symbol:"Ne", cls:"gases-nobres" },
  ],
  [
    { type:"period", num:3 },
    { id:11, symbol:"Na", cls:"metais-alcalinos" },
    { id:12, symbol:"Mg", cls:"metais-alcalino-terrosos" },
    null,null,null,null,null,null,null,null,null,null,
    { id:13, symbol:"Al", cls:"outros-metais" },
    { id:14, symbol:"Si", cls:"semimetais" },
    { id:15, symbol:"P", cls:"nao-metais" },
    { id:16, symbol:"S", cls:"nao-metais" },
    { id:17, symbol:"Cl", cls:"halogenios" },
    { id:18, symbol:"Ar", cls:"gases-nobres" },
  ],
  [
    { type:"period", num:4 },
    { id:19, symbol:"K", cls:"metais-alcalinos" },
    { id:20, symbol:"Ca", cls:"metais-alcalino-terrosos" },
    { id:21, symbol:"Sc", cls:"metais-de-transicao" },
    { id:22, symbol:"Ti", cls:"metais-de-transicao" },
    { id:23, symbol:"V", cls:"metais-de-transicao" },
    { id:24, symbol:"Cr", cls:"metais-de-transicao" },
    { id:25, symbol:"Mn", cls:"metais-de-transicao" },
    { id:26, symbol:"Fe", cls:"metais-de-transicao" },
    { id:27, symbol:"Co", cls:"metais-de-transicao" },
    { id:28, symbol:"Ni", cls:"metais-de-transicao" },
    { id:29, symbol:"Cu", cls:"metais-de-transicao" },
    { id:30, symbol:"Zn", cls:"metais-de-transicao" },
    { id:31, symbol:"Ga", cls:"outros-metais" },
    { id:32, symbol:"Ge", cls:"semimetais" },
    { id:33, symbol:"As", cls:"semimetais" },
    { id:34, symbol:"Se", cls:"nao-metais" },
    { id:35, symbol:"Br", cls:"halogenios" },
    { id:36, symbol:"Kr", cls:"gases-nobres" },
  ],
  [
    { type:"period", num:5 },
    { id:37, symbol:"Rb", cls:"metais-alcalinos" },
    { id:38, symbol:"Sr", cls:"metais-alcalino-terrosos" },
    { id:39, symbol:"Y", cls:"metais-de-transicao" },
    { id:40, symbol:"Zr", cls:"metais-de-transicao" },
    { id:41, symbol:"Nb", cls:"metais-de-transicao" },
    { id:42, symbol:"Mo", cls:"metais-de-transicao" },
    { id:43, symbol:"Tc", cls:"metais-de-transicao" },
    { id:44, symbol:"Ru", cls:"metais-de-transicao" },
    { id:45, symbol:"Rh", cls:"metais-de-transicao" },
    { id:46, symbol:"Pd", cls:"metais-de-transicao" },
    { id:47, symbol:"Ag", cls:"metais-de-transicao" },
    { id:48, symbol:"Cd", cls:"metais-de-transicao" },
    { id:49, symbol:"In", cls:"outros-metais" },
    { id:50, symbol:"Sn", cls:"outros-metais" },
    { id:51, symbol:"Sb", cls:"semimetais" },
    { id:52, symbol:"Te", cls:"semimetais" },
    { id:53, symbol:"I", cls:"halogenios" },
    { id:54, symbol:"Xe", cls:"gases-nobres" },
  ],
  [
    { type:"period", num:6 },
    { id:55, symbol:"Cs", cls:"metais-alcalinos" },
    { id:56, symbol:"Ba", cls:"metais-alcalino-terrosos" },
    null,
    { id:72, symbol:"Hf", cls:"metais-de-transicao" },
    { id:73, symbol:"Ta", cls:"metais-de-transicao" },
    { id:74, symbol:"W", cls:"metais-de-transicao" },
    { id:75, symbol:"Re", cls:"metais-de-transicao" },
    { id:76, symbol:"Os", cls:"metais-de-transicao" },
    { id:77, symbol:"Ir", cls:"metais-de-transicao" },
    { id:78, symbol:"Pt", cls:"metais-de-transicao" },
    { id:79, symbol:"Au", cls:"metais-de-transicao" },
    { id:80, symbol:"Hg", cls:"metais-de-transicao" },
    { id:81, symbol:"Tl", cls:"outros-metais" },
    { id:82, symbol:"Pb", cls:"outros-metais" },
    { id:83, symbol:"Bi", cls:"outros-metais" },
    { id:84, symbol:"Po", cls:"outros-metais" },
    { id:85, symbol:"At", cls:"halogenios" },
    { id:86, symbol:"Rn", cls:"gases-nobres" },
  ],
  [
    { type:"period", num:7 },
    { id:87, symbol:"Fr", cls:"metais-alcalinos" },
    { id:88, symbol:"Ra", cls:"metais-alcalino-terrosos" },
    null,
    { id:104, symbol:"Rf", cls:"metais-de-transicao" },
    { id:105, symbol:"Db", cls:"metais-de-transicao" },
    { id:106, symbol:"Sg", cls:"metais-de-transicao" },
    { id:107, symbol:"Bh", cls:"metais-de-transicao" },
    { id:108, symbol:"Hs", cls:"metais-de-transicao" },
    { id:109, symbol:"Mt", cls:"metais-de-transicao" },
    { id:110, symbol:"Ds", cls:"metais-de-transicao" },
    { id:111, symbol:"Rg", cls:"metais-de-transicao" },
    { id:112, symbol:"Cn", cls:"metais-de-transicao" },
    { id:113, symbol:"Nh", cls:"outros-metais" },
    { id:114, symbol:"Fl", cls:"outros-metais" },
    { id:115, symbol:"Mc", cls:"outros-metais" },
    { id:116, symbol:"Lv", cls:"outros-metais" },
    { id:117, symbol:"Ts", cls:"halogenios" },
    { id:118, symbol:"Og", cls:"gases-nobres" },
  ],
];
