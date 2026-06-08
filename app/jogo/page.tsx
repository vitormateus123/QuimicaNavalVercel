"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const GROUP_MAP: Record<string, string> = {
  "1a":"1","2a":"2","3b":"3","4b":"4","5b":"5","6b":"6","7b":"7",
  "8b":"8","9b":"9","10b":"10","1b":"11","2b":"12","3a":"13",
  "4a":"14","5a":"15","6a":"16","7a":"17","8a":"18",
};

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

// ── Modal de confirmação de seleção ──────────────────────────────────────────
function ModalConfirmar({
  nomeElemento,
  onConfirmar,
  onCancelar,
  enviando,
}: {
  nomeElemento: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  enviando: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#fffde7", borderRadius: 14, padding: "32px 36px",
          minWidth: 320, maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
          Confirmar Elemento Secreto
        </h2>
        <p style={{ color: "#555", marginBottom: 16 }}>
          Você escolheu <strong>{nomeElemento}</strong> como seu elemento secreto.
          <br />Essa escolha não pode ser desfeita!
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onCancelar}
            style={{
              background: "#e0e0e0", color: "#333", border: "none",
              borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={enviando}
            style={{
              background: "#43a047", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700,
              opacity: enviando ? 0.6 : 1,
            }}
          >
            {enviando ? "Confirmando..." : "Confirmar!"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de palpite ─────────────────────────────────────────────────────────
function ModalPalpite({
  nomeElemento,
  onConfirmar,
  onCancelar,
  enviando,
}: {
  nomeElemento: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  enviando: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#f3e5f5", borderRadius: 14, padding: "32px 36px",
          minWidth: 320, maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔍</div>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
          Enviar Palpite
        </h2>
        <p style={{ color: "#555", marginBottom: 16 }}>
          Seu palpite é <strong>{nomeElemento}</strong>.
          <br />Tem certeza que deseja enviar?
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onCancelar}
            style={{
              background: "#e0e0e0", color: "#333", border: "none",
              borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={enviando}
            style={{
              background: "#7b1fa2", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700,
              opacity: enviando ? 0.6 : 1,
            }}
          >
            {enviando ? "Enviando..." : "Enviar Palpite!"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de resultado final ─────────────────────────────────────────────────
function ModalResultado({
  estado,
  idJogador,
  onJogarNovamente,
}: {
  estado: EstadoPartida;
  idJogador: number;
  onJogarNovamente: () => void;
}) {
  const venceu = estado.vencedor === idJogador;
  const empate = estado.vencedor === null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#fffde7", borderRadius: 16, padding: "36px 40px",
          minWidth: 340, maxWidth: 460, boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 8 }}>
          {empate ? "🤝" : venceu ? "🏆" : "😔"}
        </div>
        <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 4 }}>
          {empate ? "Empate!" : venceu ? "Você Venceu!" : "Você Perdeu"}
        </h2>
        <p style={{ color: "#777", marginBottom: 20, fontSize: 14 }}>
          Partida finalizada
        </p>
        <div
          style={{
            display: "flex", gap: 16, justifyContent: "center",
            marginBottom: 24, flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "#fff", borderRadius: 10, padding: "12px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)", minWidth: 130,
            }}
          >
            <p style={{ fontWeight: 700, color: "#1565c0", marginBottom: 4, fontSize: 13 }}>
              {estado.jogador1?.nome}
            </p>
            <p style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Elemento secreto:</p>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{estado.elemento1?.nome}</p>
            <p style={{ fontSize: 12, color: "#666" }}>{estado.elemento1?.familia}</p>
          </div>
          <div
            style={{
              display: "flex", alignItems: "center",
              fontSize: 22, fontWeight: 700, color: "#bbb",
            }}
          >
            VS
          </div>
          <div
            style={{
              background: "#fff", borderRadius: 10, padding: "12px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)", minWidth: 130,
            }}
          >
            <p style={{ fontWeight: 700, color: "#2e7d32", marginBottom: 4, fontSize: 13 }}>
              {estado.jogador2?.nome}
            </p>
            <p style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Elemento secreto:</p>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{estado.elemento2?.nome}</p>
            <p style={{ fontSize: 12, color: "#666" }}>{estado.elemento2?.familia}</p>
          </div>
        </div>
        <button
          onClick={onJogarNovamente}
          style={{
            background: "#1976d2", color: "#fff", border: "none",
            borderRadius: 10, padding: "12px 32px", fontSize: 16,
            cursor: "pointer", fontWeight: 700,
          }}
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );
}

// ── Modal de palpite errado ──────────────────────────────────────────────────
function ModalErrou({
  nomeAdversario,
  onFechar,
}: {
  nomeAdversario: string;
  onFechar: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      }}
    >
      <div
        style={{
          background: "#fff3e0", borderRadius: 14, padding: "32px 36px",
          minWidth: 320, maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 8 }}>❌</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8, color: "#c62828" }}>
          Palpite Errado!
        </h2>
        <p style={{ color: "#555", marginBottom: 20, lineHeight: 1.5 }}>
          Não foi dessa vez...<br />
          Agora é a vez de <strong>{nomeAdversario}</strong> adivinhar.
        </p>
        <button
          onClick={onFechar}
          style={{
            background: "#ef6c00", color: "#fff", border: "none",
            borderRadius: 8, padding: "10px 28px", cursor: "pointer",
            fontWeight: 700, fontSize: 15,
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default function JogoPage() {
  const router = useRouter();

  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
  const [estado, setEstado] = useState<EstadoPartida | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Modais
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalPalpite, setModalPalpite] = useState(false);
  const [modalResultado, setModalResultado] = useState(false);
  const [modalErrou, setModalErrou] = useState<{ nomeAdversario: string } | null>(null);
  const resultadoMostradoRef = useRef(false);
  const vezAnteriorRef = useRef<number | null>(null);

  // Busca por distribuição eletrônica
  const [periodInput, setPeriodInput] = useState("");
  const [groupInput, setGroupInput] = useState("");
  const [valenceInput, setValenceInput] = useState("");
  const [searchErro, setSearchErro] = useState("");
  const [highlightId, setHighlightId] = useState<number | null>(null);

  // Dicas paginadas
  const [dicaVisivel, setDicaVisivel] = useState<number>(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idJogadorRef = useRef<number>(0);
  const idJogadaRef  = useRef<number>(0);

  useEffect(() => {
    idJogadorRef.current = Number(sessionStorage.getItem("idJogador") ?? "0");
    idJogadaRef.current  = Number(sessionStorage.getItem("idJogada")  ?? "0");
  }, []);

  const idJogador = typeof window !== "undefined"
    ? Number(sessionStorage.getItem("idJogador") ?? "0")
    : 0;
  const idJogada = typeof window !== "undefined"
    ? Number(sessionStorage.getItem("idJogada") ?? "0")
    : 0;

  const carregarEstado = useCallback(async () => {
    const id = typeof window !== "undefined"
      ? Number(sessionStorage.getItem("idJogada") ?? "0")
      : 0;
    if (!id) return;
    try {
      const res = await fetch(`/api/partida/estado?idJogada=${id}`);
      if (!res.ok) return;
      const data: EstadoPartida = await res.json();
      setEstado(data);

      // Detectar palpite errado: estava na minha vez, agora é do adversário
      const idJogadorAtual = typeof window !== "undefined"
        ? Number(sessionStorage.getItem("idJogador") ?? "0") : 0;
      if (
        data.status === "adivinhando" &&
        vezAnteriorRef.current === idJogadorAtual &&
        data.vez_de !== idJogadorAtual
      ) {
        const nomeAdv = data.id_jogador1 === idJogadorAtual
          ? (data.jogador2?.nome ?? "Adversário")
          : (data.jogador1?.nome ?? "Adversário");
        setModalErrou({ nomeAdversario: nomeAdv });
      }
      vezAnteriorRef.current = data.vez_de;

      // Mostrar modal de resultado quando finalizar (apenas uma vez)
      if (data.status === "finalizada" && !resultadoMostradoRef.current) {
        resultadoMostradoRef.current = true;
        setModalResultado(true);
      }
    } catch {
      // ignora falhas de rede silenciosamente
    }
  }, []);

  useEffect(() => {
    if (
      !sessionStorage.getItem("idJogador") ||
      !sessionStorage.getItem("idJogada")
    ) {
      router.push("/");
      return;
    }
    carregarEstado();
    intervalRef.current = setInterval(carregarEstado, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [carregarEstado, router]);

  // ── Derivações ────────────────────────────────────────────────────────────
  const euJogador1    = estado?.id_jogador1 === idJogador;
  const meuElementoId = estado
    ? (euJogador1 ? estado.id_elemento1 : estado.id_elemento2)
    : null;
  const meuElemento = estado
    ? (euJogador1 ? estado.elemento1 : estado.elemento2)
    : null;
  const dicasAdversario: { descricao: string }[] = estado
    ? (euJogador1 ? estado.dicas_elemento2 : estado.dicas_elemento1) ?? []
    : [];

  const finalizada  = estado?.status === "finalizada";
  const adivinhando = estado?.status === "adivinhando";
  const emAndamento = estado?.status === "em_andamento";
  const jaEscolheu  = meuElementoId !== null && meuElementoId !== undefined;
  const minhaVez    = adivinhando && estado?.vez_de === idJogador;

  // Tabela clicável apenas na fase de escolha do elemento secreto (em_andamento)
  // Na fase de adivinhação, a seleção é exclusivamente pela distribuição eletrônica
  const tabelaAtiva = emAndamento && !jaEscolheu;

  function handleCelulaClick(id: number) {
    if (!tabelaAtiva) return;
    setSelecionadoId(prev => (prev === id ? null : id));
  }

  // Mensagem de status (uma linha, nunca cresce)
  let mensagem = "";
  if (estado?.status === "aguardando") {
    mensagem = "⏳ Aguardando segundo jogador entrar na sala...";
  } else if (emAndamento) {
    if (!jaEscolheu) mensagem = "🎯 Clique em um elemento na tabela ou use a busca para escolher seu elemento secreto!";
    else mensagem = "⏳ Elemento escolhido! Aguardando o adversário...";
  } else if (adivinhando) {
    if (minhaVez) mensagem = "🔍 Sua vez! Use a distribuição eletrônica para adivinhar o elemento do adversário.";
    else mensagem = "⏳ Vez do adversário adivinhar...";
  }

  // ── Busca via distribuição eletrônica → seleciona o elemento ────────────
  function buscarElemento() {
    const period  = periodInput.trim().toLowerCase();
    let   group   = groupInput.trim().toLowerCase();
    const valence = valenceInput.trim().toLowerCase();

    if (!period && !group && !valence) {
      setSearchErro("Os campos não podem estar vazios.");
      return;
    }
    if ((period && !group) || (!period && group)) {
      setSearchErro("Período e família devem ser preenchidos juntos.");
      return;
    }
    setSearchErro("");
    group = GROUP_MAP[group] || group;

    const el = valence
      ? document.querySelector<HTMLElement>(`[data-valence='${valence}']`)
      : document.querySelector<HTMLElement>(`[data-period='${period}'][data-group='${group}']`);

    if (el) {
      const rawId = el.getAttribute("data-id");
      if (rawId) {
        const numId = Number(rawId);
        setHighlightId(numId);
        setSelecionadoId(numId); // seleciona o elemento encontrado
        setTimeout(() => setHighlightId(null), 3000);
      }
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setSearchErro("Nenhum elemento encontrado com os dados fornecidos.");
      setSelecionadoId(null);
    }
  }

  function limparSelecao() {
    setSelecionadoId(null);
    setPeriodInput("");
    setGroupInput("");
    setValenceInput("");
    setSearchErro("");
  }

  // ── Confirmar elemento secreto ────────────────────────────────────────────
  async function confirmarSelecao() {
    if (!selecionadoId || jaEscolheu || enviando || !emAndamento) return;
    setErro("");
    setEnviando(true);
    setModalConfirmar(false);
    try {
      const res = await fetch("/api/elemento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idJogador, idJogada, idElemento: selecionadoId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Erro ao confirmar elemento");
      } else {
        setSelecionadoId(null);
        await carregarEstado();
      }
    } catch {
      setErro("Erro de conexão ao confirmar elemento");
    } finally {
      setEnviando(false);
    }
  }

  // ── Enviar palpite ────────────────────────────────────────────────────────
  async function confirmarPalpite() {
    if (!selecionadoId || !minhaVez || enviando) return;
    setErro("");
    setEnviando(true);
    setModalPalpite(false);
    try {
      const res = await fetch("/api/partida/palpite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idJogador, idJogada, idPalpite: selecionadoId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Erro ao enviar palpite");
      } else {
        setSelecionadoId(null);
        await carregarEstado();
      }
    } catch {
      setErro("Erro de conexão ao enviar palpite");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Modais ── */}
      {modalConfirmar && selecionadoId && (
        <ModalConfirmar
          nomeElemento={ELEMENTO_NOME[selecionadoId] ?? `Elemento #${selecionadoId}`}
          onConfirmar={confirmarSelecao}
          onCancelar={() => setModalConfirmar(false)}
          enviando={enviando}
        />
      )}
      {modalPalpite && selecionadoId && (
        <ModalPalpite
          nomeElemento={ELEMENTO_NOME[selecionadoId] ?? `Elemento #${selecionadoId}`}
          onConfirmar={confirmarPalpite}
          onCancelar={() => setModalPalpite(false)}
          enviando={enviando}
        />
      )}
      {modalErrou && (
        <ModalErrou
          nomeAdversario={modalErrou.nomeAdversario}
          onFechar={() => setModalErrou(null)}
        />
      )}
      {modalResultado && estado && finalizada && (
        <ModalResultado
          estado={estado}
          idJogador={idJogador}
          onJogarNovamente={() => { setModalResultado(false); router.push("/sala"); }}
        />
      )}

      {/* ── Header ── */}
      <header
        className="py-3 text-center shadow-sm sticky top-0 z-20"
        style={{ background: "rgba(25,118,210,0.95)" }}
      >
        <h1
          className="m-0 text-white leading-none"
          style={{
            fontFamily: "'Kolker Brush', serif",
            fontSize: "clamp(40px,6vw,90px)",
            textShadow: "0 3px 3px white",
          }}
        >
          Química Naval
        </h1>
        {mensagem && (
          <p
            className="text-blue-100 text-sm mt-1 font-medium"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 16px" }}
          >
            {mensagem}
          </p>
        )}
        {estado && (
          <p className="text-blue-200 text-xs mt-0.5" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Sala #{estado.id_jogada} — {estado.jogador1?.nome} vs{" "}
            {estado.jogador2?.nome ?? "aguardando..."}
          </p>
        )}
      </header>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-center" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {erro}
        </div>
      )}

      {/* ── Tabela periódica (layout intocado) ── */}
      <div className="overflow-x-auto py-4 px-2">
        <table
          className="periodic-table"
          style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
        >
          <tbody>
            <tr>
              <Td />
              <Td>
                <b className="Family text-center text-xs block">1(s¹)</b>
              </Td>
              <Td /><Td /><Td /><Td /><Td /><Td /><Td /><Td /><Td /><Td /><Td />
              <Td>
                <b className="Family text-center text-xs block">13(s²p¹)</b>
              </Td>
              <Td>
                <b className="Family text-center text-xs block">14(s²p²)</b>
              </Td>
              <Td>
                <b className="Family text-center text-xs block">15(s²p³)</b>
              </Td>
              <Td>
                <b className="Family text-center text-xs block">16(s²p⁴)</b>
              </Td>
              <Td>
                <b className="Family text-center text-xs block">17(s²p⁵)</b>
              </Td>
              <Td>
                <b className="Family text-center text-xs block">18(s²p⁶)</b>
              </Td>
            </tr>
            {ROWS.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  if (!cell) return <Td key={ci} />;
                  if ("type" in cell && cell.type === "label")
                    return (
                      <Td key={ci}>
                        <b className="Family text-center text-xs block">
                          {cell.text}
                        </b>
                      </Td>
                    );
                  if ("type" in cell && cell.type === "period")
                    return (
                      <Td key={ci}>
                        <small className="periodNumbers">
                          <sub>{cell.num}</sub>
                        </small>
                      </Td>
                    );
                  if ("type" in cell) return <Td key={ci} />;

                  const isSelected  = selecionadoId === cell.id;
                  const isHighlight = highlightId   === cell.id;
                  const isMyChoice  = jaEscolheu && meuElementoId === cell.id;

                  return (
                    <td
                      key={ci}
                      className={[
                        "tdBorder",
                        cell.cls,
                        isSelected  ? "destaque"      : "",
                        isHighlight ? "highlight"      : "",
                        isMyChoice  ? "finalSelection" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      data-period={cell.period}
                      data-group={cell.group}
                      data-valence={cell.valence}
                      data-id={cell.id}
                      onClick={() => handleCelulaClick(cell.id)}
                      style={{ cursor: tabelaAtiva ? "pointer" : "default" }}
                    >
                      <span className="text-center block text-xs">{cell.id}</span>
                      <b className="text-center block text-sm">{cell.symbol}</b>
                      <small className="text-center block text-xs leading-tight">
                        {cell.name}
                      </small>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Barra de ação ── */}
      {!finalizada && (
        <div className="px-4 pb-2 flex flex-col items-center gap-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 w-full max-w-3xl flex items-center justify-between gap-4">
            <div style={{ overflow: "hidden" }}>
              <span className="font-semibold text-sm">Selecionado: </span>
              <span
                className="text-sm"
                style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", maxWidth: 200, verticalAlign: "bottom" }}
              >
                {selecionadoId
                  ? ELEMENTO_NOME[selecionadoId] ?? `Elemento #${selecionadoId}`
                  : "Nenhum"}
              </span>
            </div>
            <div className="flex gap-2" style={{ flexShrink: 0 }}>
              <button
                onClick={limparSelecao}
                disabled={!selecionadoId}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ whiteSpace: "nowrap" }}
              >
                Limpar
              </button>
              {adivinhando ? (
                <button
                  onClick={() => { if (selecionadoId && minhaVez) setModalPalpite(true); }}
                  disabled={!selecionadoId || !minhaVez || enviando}
                  className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {!minhaVez ? "⏳ Vez do adversário" : "Enviar Palpite"}
                </button>
              ) : (
                <button
                  onClick={() => { if (selecionadoId && !jaEscolheu && emAndamento) setModalConfirmar(true); }}
                  disabled={!selecionadoId || jaEscolheu || !emAndamento || enviando}
                  className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {jaEscolheu ? "✅ Elemento Confirmado" : "Confirmar Seleção"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Painel inferior ── */}
      <div className="flex flex-col md:flex-row gap-4 p-4 justify-around">

        {/* Busca por distribuição eletrônica — seleciona o elemento */}
        <div className="bg-amber-50 rounded-xl p-4 flex-1 max-w-md shadow">
          <h2 className="text-center font-semibold text-lg mb-3">
            {emAndamento && !jaEscolheu
              ? "🔒 Escolha seu Elemento Secreto"
              : "🔍 Adivinhe pela Distribuição Eletrônica"}
          </h2>
          {emAndamento && !jaEscolheu && (
            <p className="text-xs text-center text-gray-500 mb-3 -mt-1">
              Use a busca <em>ou</em> clique diretamente na tabela acima
            </p>
          )}
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <input
                type="text"
                value={periodInput}
                onChange={(e) => { setPeriodInput(e.target.value); setValenceInput(""); }}
                onKeyDown={(e) => e.key === "Enter" && buscarElemento()}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Período"
              />
              <p className="text-center text-xs mt-1 text-gray-600">Período</p>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={groupInput}
                onChange={(e) => { setGroupInput(e.target.value); setValenceInput(""); }}
                onKeyDown={(e) => e.key === "Enter" && buscarElemento()}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="Família"
              />
              <p className="text-center text-xs mt-1 text-gray-600">Família</p>
            </div>
          </div>
          <input
            type="text"
            value={valenceInput}
            onChange={(e) => { setValenceInput(e.target.value); setPeriodInput(""); setGroupInput(""); }}
            onKeyDown={(e) => e.key === "Enter" && buscarElemento()}
            className="w-full border rounded px-2 py-1 text-sm mb-2"
            placeholder="Ex: 1s1"
          />
          <p className="text-center text-xs mb-3 text-gray-600">Camada de Valência</p>
          <button
            onClick={buscarElemento}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
          >
            {emAndamento && !jaEscolheu ? "Buscar e Selecionar Elemento" : "Buscar Elemento para Palpite"}
          </button>
          {searchErro && (
            <p className="text-red-600 text-xs mt-2" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {searchErro}
            </p>
          )}
          {selecionadoId && (
            <p className="text-green-700 text-xs mt-2 font-semibold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              ✅ Selecionado: {ELEMENTO_NOME[selecionadoId] ?? `#${selecionadoId}`}
            </p>
          )}
        </div>

        {/* Painel direito: status / dicas paginadas */}
        <div className="bg-amber-50 rounded-xl p-4 flex-1 max-w-lg shadow">

          {/* Fase de escolha */}
          {(estado?.status === "aguardando" || emAndamento) && (
            <>
              <h2 className="text-center font-semibold text-lg mb-3">
                Status da Partida
              </h2>
              <div
                style={{
                  background: "rgb(228,209,187)",
                  borderRadius: "7px",
                  padding: "12px",
                  minHeight: "120px",
                }}
              >
                {!estado ? (
                  <p className="text-gray-500 text-sm">Carregando...</p>
                ) : estado.status === "aguardando" ? (
                  <div className="text-center">
                    <p className="font-semibold text-lg mb-2">🔑 ID da sua sala:</p>
                    <p className="text-4xl font-bold text-blue-700 mb-2">{estado.id_jogada}</p>
                    <p className="text-sm text-gray-600">
                      Compartilhe este ID com o adversário para ele entrar na sala.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-around text-center">
                      <div>
                        <p className="text-xs font-semibold text-blue-700" style={{ whiteSpace: "nowrap" }}>
                          {estado.jogador1?.nome}
                        </p>
                        <p className="text-2xl mt-1">{estado.id_elemento1 ? "✅" : "⏳"}</p>
                        <p className="text-xs text-gray-500">{estado.id_elemento1 ? "Escolheu" : "Escolhendo..."}</p>
                      </div>
                      <div className="flex items-center text-gray-400 font-bold">VS</div>
                      <div>
                        <p className="text-xs font-semibold text-green-700" style={{ whiteSpace: "nowrap" }}>
                          {estado.jogador2?.nome}
                        </p>
                        <p className="text-2xl mt-1">{estado.id_elemento2 ? "✅" : "⏳"}</p>
                        <p className="text-xs text-gray-500">{estado.id_elemento2 ? "Escolheu" : "Escolhendo..."}</p>
                      </div>
                    </div>
                    {meuElemento && (
                      <div className="mt-3 pt-3 border-t border-amber-300">
                        <p className="text-xs font-semibold mb-1">Seu elemento secreto:</p>
                        <p className="font-bold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {meuElemento.nome}{" "}
                          <span className="font-normal text-sm text-gray-600">— {meuElemento.familia}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Fase de adivinhação — dicas paginadas (sem crescer) */}
          {(adivinhando || finalizada) && (
            <>
              <h2 className="text-center font-semibold text-lg mb-3">
                {adivinhando ? "🔍 Dicas do Elemento Adversário" : "📋 Resultado"}
              </h2>
              <div
                style={{
                  background: "rgb(228,209,187)",
                  borderRadius: "7px",
                  padding: "12px",
                }}
              >
                {/* Meu elemento secreto */}
                {meuElemento && (
                  <div className="mb-3 pb-3 border-b border-amber-400">
                    <p className="text-xs font-semibold text-gray-600">Seu elemento secreto:</p>
                    <p
                      className="font-bold text-blue-700"
                      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {meuElemento.nome} —{" "}
                      <span className="font-normal text-sm">{meuElemento.familia}</span>
                    </p>
                  </div>
                )}

                {/* Dicas — apenas UMA visível por vez + navegação */}
                {dicasAdversario.length > 0 ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <p className="text-xs font-semibold text-gray-700">
                        Dica {dicaVisivel + 1} de {dicasAdversario.length}
                      </p>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => setDicaVisivel(v => Math.max(0, v - 1))}
                          disabled={dicaVisivel === 0}
                          style={{
                            background: dicaVisivel === 0 ? "#ddd" : "#f59e0b",
                            color: dicaVisivel === 0 ? "#aaa" : "#fff",
                            border: "none", borderRadius: 6, padding: "2px 10px",
                            cursor: dicaVisivel === 0 ? "not-allowed" : "pointer",
                            fontSize: 14, fontWeight: 700,
                          }}
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setDicaVisivel(v => Math.min(dicasAdversario.length - 1, v + 1))}
                          disabled={dicaVisivel === dicasAdversario.length - 1}
                          style={{
                            background: dicaVisivel === dicasAdversario.length - 1 ? "#ddd" : "#f59e0b",
                            color: dicaVisivel === dicasAdversario.length - 1 ? "#aaa" : "#fff",
                            border: "none", borderRadius: 6, padding: "2px 10px",
                            cursor: dicaVisivel === dicasAdversario.length - 1 ? "not-allowed" : "pointer",
                            fontSize: 14, fontWeight: 700,
                          }}
                        >
                          ›
                        </button>
                      </div>
                    </div>
                    {/* Caixa de dica com altura fixa — nunca cresce */}
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: "10px 14px",
                        border: "1px solid #fbbf24",
                        minHeight: 64,
                        maxHeight: 80,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <p className="text-sm text-gray-700" style={{ margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const }}>
                        <span className="font-semibold text-amber-700">#{dicaVisivel + 1} </span>
                        {dicasAdversario[dicaVisivel]?.descricao}
                      </p>
                    </div>
                    {/* Indicadores de página */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
                      {dicasAdversario.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setDicaVisivel(i)}
                          style={{
                            width: 8, height: 8, borderRadius: "50%", border: "none",
                            background: i === dicaVisivel ? "#f59e0b" : "#d1d5db",
                            cursor: "pointer", padding: 0,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {adivinhando ? "Carregando dicas..." : "Nenhuma dica cadastrada."}
                  </p>
                )}

                {/* Turno atual */}
                {adivinhando && (
                  <div className="mt-3 pt-3 border-t border-amber-400">
                    <p className="text-xs font-semibold text-center mb-2 text-gray-600">
                      Turno atual:
                    </p>
                    <div className="flex justify-around text-center">
                      <div>
                        <p className="text-xs font-semibold text-blue-700" style={{ whiteSpace: "nowrap" }}>
                          {estado?.jogador1?.nome}
                        </p>
                        <p className="text-xl mt-1">
                          {estado?.vez_de === estado?.id_jogador1 ? "🎯" : "⏳"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {estado?.vez_de === estado?.id_jogador1 ? "Vez dele!" : "Aguardando..."}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-400 font-bold text-sm">VS</div>
                      <div>
                        <p className="text-xs font-semibold text-green-700" style={{ whiteSpace: "nowrap" }}>
                          {estado?.jogador2?.nome}
                        </p>
                        <p className="text-xl mt-1">
                          {estado?.vez_de === estado?.id_jogador2 ? "🎯" : "⏳"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {estado?.vez_de === estado?.id_jogador2 ? "Vez dele!" : "Aguardando..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resultado parcial quando finalizada */}
                {finalizada && (
                  <div className="mt-3 pt-3 border-t border-amber-400 text-center">
                    <p
                      className={`font-bold text-lg ${
                        estado?.vencedor === idJogador ? "text-green-600" : "text-red-500"
                      }`}
                      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {estado?.vencedor === idJogador
                        ? "✅ Você acertou e venceu!"
                        : "❌ O adversário acertou primeiro."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Td({ children }: { children?: React.ReactNode }) {
  return <td style={{ width: 60, height: 60 }}>{children}</td>;
}

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

const ROWS: Array<Array<null | { type: "label"; text: string } | { type: "period"; num: number } | {
  id: number; symbol: string; name: string; period: number; group: number; valence: string; cls: string;
}>> = [
  // Período 1
  [
    { type: "period", num: 1 },
    { id:1, symbol:"H", name:"Hidrogênio", period:1, group:1, valence:"1s1", cls:"nao-metais tdBorder" },
    null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
    { id:2, symbol:"He", name:"Hélio", period:1, group:18, valence:"1s2", cls:"gases-nobres tdBorder" },
  ],
  // Período 2
  [
    { type:"period", num:2 },
    { id:3, symbol:"Li", name:"Lítio", period:2, group:1, valence:"2s1", cls:"metais-alcalinos tdBorder" },
    { id:4, symbol:"Be", name:"Berílio", period:2, group:2, valence:"2s2", cls:"metais-alcalino-terrosos tdBorder" },
    null,null,null,null,null,null,null,null,null,null,
    { id:5, symbol:"B", name:"Boro", period:2, group:13, valence:"2s2 2p1", cls:"semimetais tdBorder" },
    { id:6, symbol:"C", name:"Carbono", period:2, group:14, valence:"2s2 2p2", cls:"nao-metais tdBorder" },
    { id:7, symbol:"N", name:"Nitrogênio", period:2, group:15, valence:"2s2 2p3", cls:"nao-metais tdBorder" },
    { id:8, symbol:"O", name:"Oxigênio", period:2, group:16, valence:"2s2 2p4", cls:"nao-metais tdBorder" },
    { id:9, symbol:"F", name:"Flúor", period:2, group:17, valence:"2s2 2p5", cls:"halogenios tdBorder" },
    { id:10, symbol:"Ne", name:"Neônio", period:2, group:18, valence:"2s2 2p6", cls:"gases-nobres tdBorder" },
  ],
  // Período 3
  [
    { type:"period", num:3 },
    { id:11, symbol:"Na", name:"Sódio", period:3, group:1, valence:"3s1", cls:"metais-alcalinos tdBorder" },
    { id:12, symbol:"Mg", name:"Magnésio", period:3, group:2, valence:"3s2", cls:"metais-alcalino-terrosos tdBorder" },
    { type:"label", text:"3(d¹)" },{ type:"label", text:"4(d²)" },{ type:"label", text:"5(d³)" },
    { type:"label", text:"6(d⁴)" },{ type:"label", text:"7(d⁵)" },{ type:"label", text:"8(d⁶)" },
    { type:"label", text:"9(d⁷)" },{ type:"label", text:"10(d⁸)" },{ type:"label", text:"11(d⁹)" },{ type:"label", text:"12(d¹⁰)" },
    { id:13, symbol:"Al", name:"Alumínio", period:3, group:13, valence:"3s2 3p1", cls:"outros-metais tdBorder" },
    { id:14, symbol:"Si", name:"Silício", period:3, group:14, valence:"3s2 3p2", cls:"semimetais tdBorder" },
    { id:15, symbol:"P", name:"Fósforo", period:3, group:15, valence:"3s2 3p3", cls:"nao-metais tdBorder" },
    { id:16, symbol:"S", name:"Enxofre", period:3, group:16, valence:"3s2 3p4", cls:"nao-metais tdBorder" },
    { id:17, symbol:"Cl", name:"Cloro", period:3, group:17, valence:"3s2 3p5", cls:"halogenios tdBorder" },
    { id:18, symbol:"Ar", name:"Argônio", period:3, group:18, valence:"3s2 3p6", cls:"gases-nobres tdBorder" },
  ],
  // Período 4
  [
    { type:"period", num:4 },
    { id:19, symbol:"K", name:"Potássio", period:4, group:1, valence:"4s1", cls:"metais-alcalinos tdBorder" },
    { id:20, symbol:"Ca", name:"Cálcio", period:4, group:2, valence:"4s2", cls:"metais-alcalino-terrosos tdBorder" },
    { id:21, symbol:"Sc", name:"Escândio", period:4, group:3, valence:"3d1 4s2", cls:"metais-de-transicao tdBorder" },
    { id:22, symbol:"Ti", name:"Titânio", period:4, group:4, valence:"3d2 4s2", cls:"metais-de-transicao tdBorder" },
    { id:23, symbol:"V", name:"Vanádio", period:4, group:5, valence:"3d3 4s2", cls:"metais-de-transicao tdBorder" },
    { id:24, symbol:"Cr", name:"Cromo", period:4, group:6, valence:"3d4 4s2", cls:"metais-de-transicao tdBorder" },
    { id:25, symbol:"Mn", name:"Manganês", period:4, group:7, valence:"3d5 4s2", cls:"metais-de-transicao tdBorder" },
    { id:26, symbol:"Fe", name:"Ferro", period:4, group:8, valence:"3d6 4s2", cls:"metais-de-transicao tdBorder" },
    { id:27, symbol:"Co", name:"Cobalto", period:4, group:9, valence:"3d7 4s2", cls:"metais-de-transicao tdBorder" },
    { id:28, symbol:"Ni", name:"Níquel", period:4, group:10, valence:"3d8 4s2", cls:"metais-de-transicao tdBorder" },
    { id:29, symbol:"Cu", name:"Cobre", period:4, group:11, valence:"3d9 4s2", cls:"metais-de-transicao tdBorder" },
    { id:30, symbol:"Zn", name:"Zinco", period:4, group:12, valence:"3d10 4s2", cls:"metais-de-transicao tdBorder" },
    { id:31, symbol:"Ga", name:"Gálio", period:4, group:13, valence:"4s2 4p1", cls:"outros-metais tdBorder" },
    { id:32, symbol:"Ge", name:"Germânio", period:4, group:14, valence:"4s2 4p2", cls:"semimetais tdBorder" },
    { id:33, symbol:"As", name:"Arsênio", period:4, group:15, valence:"4s2 4p3", cls:"semimetais tdBorder" },
    { id:34, symbol:"Se", name:"Selênio", period:4, group:16, valence:"4s2 4p4", cls:"nao-metais tdBorder" },
    { id:35, symbol:"Br", name:"Bromo", period:4, group:17, valence:"4s2 4p5", cls:"halogenios tdBorder" },
    { id:36, symbol:"Kr", name:"Criptônio", period:4, group:18, valence:"4s2 4p6", cls:"gases-nobres tdBorder" },
  ],
  // Período 5
  [
    { type:"period", num:5 },
    { id:37, symbol:"Rb", name:"Rubídio", period:5, group:1, valence:"5s1", cls:"metais-alcalinos tdBorder" },
    { id:38, symbol:"Sr", name:"Estrôncio", period:5, group:2, valence:"5s2", cls:"metais-alcalino-terrosos tdBorder" },
    { id:39, symbol:"Y", name:"Ítrio", period:5, group:3, valence:"4d1 5s2", cls:"metais-de-transicao tdBorder" },
    { id:40, symbol:"Zr", name:"Zircônio", period:5, group:4, valence:"4d2 5s2", cls:"metais-de-transicao tdBorder" },
    { id:41, symbol:"Nb", name:"Nióbio", period:5, group:5, valence:"4d4 5s1", cls:"metais-de-transicao tdBorder" },
    { id:42, symbol:"Mo", name:"Molibdênio", period:5, group:6, valence:"4d5 5s2", cls:"metais-de-transicao tdBorder" },
    { id:43, symbol:"Tc", name:"Tecnécio", period:5, group:7, valence:"4d7 5s2", cls:"metais-de-transicao tdBorder" },
    { id:44, symbol:"Ru", name:"Rutênio", period:5, group:8, valence:"4d7 5s1", cls:"metais-de-transicao tdBorder" },
    { id:45, symbol:"Rh", name:"Ródio", period:5, group:9, valence:"4d8 5s1", cls:"metais-de-transicao tdBorder" },
    { id:46, symbol:"Pd", name:"Paládio", period:5, group:10, valence:"4d10", cls:"metais-de-transicao tdBorder" },
    { id:47, symbol:"Ag", name:"Prata", period:5, group:11, valence:"4d10 5s1", cls:"metais-de-transicao tdBorder" },
    { id:48, symbol:"Cd", name:"Cádmio", period:5, group:12, valence:"4d10 5s2", cls:"metais-de-transicao tdBorder" },
    { id:49, symbol:"In", name:"Índio", period:5, group:13, valence:"5s2 5p1", cls:"outros-metais tdBorder" },
    { id:50, symbol:"Sn", name:"Estanho", period:5, group:14, valence:"5s2 5p2", cls:"outros-metais tdBorder" },
    { id:51, symbol:"Sb", name:"Antimônio", period:5, group:15, valence:"5s2 5p3", cls:"semimetais tdBorder" },
    { id:52, symbol:"Te", name:"Telúrio", period:5, group:16, valence:"5s2 5p4", cls:"semimetais tdBorder" },
    { id:53, symbol:"I", name:"Iodo", period:5, group:17, valence:"5s2 5p5", cls:"halogenios tdBorder" },
    { id:54, symbol:"Xe", name:"Xenônio", period:5, group:18, valence:"5s2 5p6", cls:"gases-nobres tdBorder" },
  ],
  // Período 6
  [
    { type:"period", num:6 },
    { id:55, symbol:"Cs", name:"Césio", period:6, group:1, valence:"6s1", cls:"metais-alcalinos tdBorder" },
    { id:56, symbol:"Ba", name:"Bário", period:6, group:2, valence:"6s2", cls:"metais-alcalino-terrosos tdBorder" },
    null,
    { id:72, symbol:"Hf", name:"Háfnio", period:6, group:4, valence:"5d2 6s2", cls:"metais-de-transicao tdBorder" },
    { id:73, symbol:"Ta", name:"Tântalo", period:6, group:5, valence:"5d3 6s2", cls:"metais-de-transicao tdBorder" },
    { id:74, symbol:"W", name:"Tungstênio", period:6, group:6, valence:"5d4 6s2", cls:"metais-de-transicao tdBorder" },
    { id:75, symbol:"Re", name:"Rênio", period:6, group:7, valence:"5d5 6s2", cls:"metais-de-transicao tdBorder" },
    { id:76, symbol:"Os", name:"Ósmio", period:6, group:8, valence:"5d6 6s2", cls:"metais-de-transicao tdBorder" },
    { id:77, symbol:"Ir", name:"Irídio", period:6, group:9, valence:"5d7 6s2", cls:"metais-de-transicao tdBorder" },
    { id:78, symbol:"Pt", name:"Platina", period:6, group:10, valence:"5d9 6s1", cls:"metais-de-transicao tdBorder" },
    { id:79, symbol:"Au", name:"Ouro", period:6, group:11, valence:"5d10 6s1", cls:"metais-de-transicao tdBorder" },
    { id:80, symbol:"Hg", name:"Mercúrio", period:6, group:12, valence:"5d10 6s2", cls:"metais-de-transicao tdBorder" },
    { id:81, symbol:"Tl", name:"Tálio", period:6, group:13, valence:"6s2 6p1", cls:"outros-metais tdBorder" },
    { id:82, symbol:"Pb", name:"Chumbo", period:6, group:14, valence:"6s2 6p2", cls:"outros-metais tdBorder" },
    { id:83, symbol:"Bi", name:"Bismuto", period:6, group:15, valence:"6s2 6p3", cls:"outros-metais tdBorder" },
    { id:84, symbol:"Po", name:"Polônio", period:6, group:16, valence:"6s2 6p4", cls:"outros-metais tdBorder" },
    { id:85, symbol:"At", name:"Astato", period:6, group:17, valence:"6s2 6p5", cls:"halogenios tdBorder" },
    { id:86, symbol:"Rn", name:"Radônio", period:6, group:18, valence:"6s2 6p6", cls:"gases-nobres tdBorder" },
  ],
  // Período 7
  [
    { type:"period", num:7 },
    { id:87, symbol:"Fr", name:"Frâncio", period:7, group:1, valence:"7s1", cls:"metais-alcalinos tdBorder" },
    { id:88, symbol:"Ra", name:"Rádio", period:7, group:2, valence:"7s2", cls:"metais-alcalino-terrosos tdBorder" },
    null,
    { id:104, symbol:"Rf", name:"Rutherfórdio", period:7, group:4, valence:"6d2 7s2", cls:"metais-de-transicao tdBorder" },
    { id:105, symbol:"Db", name:"Dúbnio", period:7, group:5, valence:"6d3 7s2", cls:"metais-de-transicao tdBorder" },
    { id:106, symbol:"Sg", name:"Seabórgio", period:7, group:6, valence:"6d4 7s2", cls:"metais-de-transicao tdBorder" },
    { id:107, symbol:"Bh", name:"Bóhrio", period:7, group:7, valence:"6d5 7s2", cls:"metais-de-transicao tdBorder" },
    { id:108, symbol:"Hs", name:"Hássio", period:7, group:8, valence:"6d6 7s2", cls:"metais-de-transicao tdBorder" },
    { id:109, symbol:"Mt", name:"Meitnério", period:7, group:9, valence:"6d7 7s2", cls:"metais-de-transicao tdBorder" },
    { id:110, symbol:"Ds", name:"Darmstádio", period:7, group:10, valence:"6d8 7s2", cls:"metais-de-transicao tdBorder" },
    { id:111, symbol:"Rg", name:"Roentgênio", period:7, group:11, valence:"6d9 7s2", cls:"metais-de-transicao tdBorder" },
    { id:112, symbol:"Cn", name:"Copernício", period:7, group:12, valence:"6d10 7s2", cls:"metais-de-transicao tdBorder" },
    { id:113, symbol:"Nh", name:"Nihônio", period:7, group:13, valence:"7s2 7p1", cls:"outros-metais tdBorder" },
    { id:114, symbol:"Fl", name:"Fleróvio", period:7, group:14, valence:"7s2 7p2", cls:"outros-metais tdBorder" },
    { id:115, symbol:"Mc", name:"Moscóvio", period:7, group:15, valence:"7s2 7p3", cls:"outros-metais tdBorder" },
    { id:116, symbol:"Lv", name:"Livermório", period:7, group:16, valence:"7s2 7p4", cls:"outros-metais tdBorder" },
    { id:117, symbol:"Ts", name:"Tenessino", period:7, group:17, valence:"7s2 7p5", cls:"halogenios tdBorder" },
    { id:118, symbol:"Og", name:"Oganessônio", period:7, group:18, valence:"7s2 7p6", cls:"gases-nobres tdBorder" },
  ],
];
