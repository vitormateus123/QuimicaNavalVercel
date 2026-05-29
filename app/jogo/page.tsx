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
  jogador1: { nome: string } | null;
  jogador2: { nome: string } | null;
  elemento1: { id_elemento: number; nome: string; familia: string } | null;
  elemento2: { id_elemento: number; nome: string; familia: string } | null;
}

export default function JogoPage() {
  const router = useRouter();
  const [selecionado, setSelecionado] = useState<HTMLElement | null>(null);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);
  const [elementoConfirmado, setElementoConfirmado] = useState(false);
  const [estado, setEstado] = useState<EstadoPartida | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [groupInput, setGroupInput] = useState("");
  const [valenceInput, setValenceInput] = useState("");
  const [searchErro, setSearchErro] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [meuTurnoConfirmado, setMeuTurnoConfirmado] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const idJogador = typeof window !== "undefined" ? Number(sessionStorage.getItem("idJogador")) : 0;
  const idJogada = typeof window !== "undefined" ? Number(sessionStorage.getItem("idJogada")) : 0;

  const carregarEstado = useCallback(async () => {
    if (!idJogada) return;
    const res = await fetch(`/api/partida/estado?idJogada=${idJogada}`);
    if (!res.ok) return;
    const data: EstadoPartida = await res.json();
    setEstado(data);

    // Verificar se já confirmou elemento
    if (data.id_jogador1 === idJogador && data.id_elemento1) setElementoConfirmado(true);
    if (data.id_jogador2 === idJogador && data.id_elemento2) setElementoConfirmado(true);

    // Atualizar mensagem de status
    if (data.status === "aguardando") {
      setMensagem("⏳ Aguardando segundo jogador entrar na sala...");
    } else if (data.status === "em_andamento") {
      const euJogador1 = data.id_jogador1 === idJogador;
      const meuElemento = euJogador1 ? data.id_elemento1 : data.id_elemento2;
      const outroElemento = euJogador1 ? data.id_elemento2 : data.id_elemento1;
      if (!meuElemento) {
        setMensagem("🎯 Escolha seu elemento na tabela periódica!");
      } else if (!outroElemento) {
        setMensagem("⏳ Aguardando o adversário escolher o elemento...");
      }
    }
  }, [idJogada, idJogador]);

  useEffect(() => {
    if (!sessionStorage.getItem("idJogador") || !sessionStorage.getItem("idJogada")) {
      router.push("/");
      return;
    }
    carregarEstado();
    intervalRef.current = setInterval(carregarEstado, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [carregarEstado, router]);

  function alternarSelecao(el: HTMLElement, id: string) {
    if (elementoConfirmado) return;
    if (selecionado) selecionado.classList.remove("destaque");
    if (selecionado === el) {
      setSelecionado(null);
      setSelecionadoId(null);
      return;
    }
    el.classList.add("destaque");
    setSelecionado(el);
    setSelecionadoId(id);
  }

  async function confirmarSelecao() {
    if (!selecionadoId || elementoConfirmado) return;
    setErro("");

    const res = await fetch("/api/elemento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idJogador,
        idJogada,
        idElemento: Number(selecionadoId),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErro(data.error);
      return;
    }

    if (selecionado) {
      selecionado.classList.remove("destaque");
      selecionado.classList.add("finalSelection");
    }
    setElementoConfirmado(true);
    setMensagem("✅ Elemento escolhido! Aguardando adversário...");
    await carregarEstado();
  }

  function limparSelecao() {
    if (selecionado) selecionado.classList.remove("destaque");
    setSelecionado(null);
    setSelecionadoId(null);
  }

  function buscarElemento() {
    const period = periodInput.trim().toLowerCase();
    let group = groupInput.trim().toLowerCase();
    const valence = valenceInput.trim().toLowerCase();

    if (!period && !group && !valence) {
      setSearchErro("Os campos não podem estar vazios.");
      return;
    }
    if ((period && !group) || (!period && group)) {
      setSearchErro("Período e grupo devem ser preenchidos juntos.");
      return;
    }
    setSearchErro("");
    group = GROUP_MAP[group] || group;

    const el = valence
      ? document.querySelector<HTMLElement>(`[data-valence='${valence}']`)
      : document.querySelector<HTMLElement>(`[data-period='${period}'][data-group='${group}']`);

    if (el) {
      const id = el.getAttribute("data-id");
      setHighlightId(id);
      setTimeout(() => setHighlightId(null), 3000);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setSearchErro("Nenhum elemento encontrado com os dados fornecidos.");
    }
  }

  const euJogador1 = estado?.id_jogador1 === idJogador;
  const meuElemento = estado ? (euJogador1 ? estado.elemento1 : estado.elemento2) : null;
  const outroElemento = estado ? (euJogador1 ? estado.elemento2 : estado.elemento1) : null;
  const outroJogador = estado ? (euJogador1 ? estado.jogador2 : estado.jogador1) : null;
  const finalizada = estado?.status === "finalizada";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-3 text-center shadow-sm sticky top-0 z-20" style={{ background: "rgba(25,118,210,0.95)" }}>
        <h1
          className="m-0 text-white leading-none"
          style={{ fontFamily: "'Kolker Brush', serif", fontSize: "clamp(40px,6vw,90px)", textShadow: "0 3px 3px white" }}
        >
          Química Naval
        </h1>
        {mensagem && (
          <p className="text-blue-100 text-sm mt-1 font-medium">{mensagem}</p>
        )}
        {estado && (
          <p className="text-blue-200 text-xs mt-0.5">
            Sala #{estado.id_jogada} — {estado.jogador1?.nome} vs {estado.jogador2?.nome ?? "aguardando..."}
          </p>
        )}
      </header>

      {/* Status de fim de jogo */}
      {finalizada && (
        <div className="bg-yellow-50 border-b-4 border-yellow-400 p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">🏆 Partida Finalizada!</h2>
          <div className="flex justify-center gap-10 flex-wrap">
            <div className="bg-white rounded-xl p-4 shadow min-w-[200px]">
              <p className="font-semibold text-blue-700 mb-1">{estado?.jogador1?.nome}</p>
              {estado?.elemento1 ? (
                <>
                  <p className="text-lg font-bold">{estado.elemento1.nome}</p>
                  <p className="text-sm text-gray-600">{estado.elemento1.familia}</p>
                </>
              ) : <p className="text-gray-400">Não escolheu</p>}
            </div>
            <div className="flex items-center text-3xl font-bold text-gray-400">VS</div>
            <div className="bg-white rounded-xl p-4 shadow min-w-[200px]">
              <p className="font-semibold text-green-700 mb-1">{estado?.jogador2?.nome}</p>
              {estado?.elemento2 ? (
                <>
                  <p className="text-lg font-bold">{estado.elemento2.nome}</p>
                  <p className="text-sm text-gray-600">{estado.elemento2.familia}</p>
                </>
              ) : <p className="text-gray-400">Não escolheu</p>}
            </div>
          </div>
          <button
            onClick={() => router.push("/sala")}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Jogar Novamente
          </button>
        </div>
      )}

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-center">
          {erro}
        </div>
      )}

      {/* Tabela periódica */}
      <div className="overflow-x-auto py-4 px-2">
        <table className="periodic-table" style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <tbody>
            {/* Linha 0: cabeçalhos de grupos */}
            <tr>
              <Td/>
              <Td><b className="Family text-center text-xs block">1(s¹)</b></Td>
              <Td/><Td/><Td/><Td/><Td/><Td/><Td/><Td/><Td/><Td/><Td/>
              <Td><b className="Family text-center text-xs block">13(s²p¹)</b></Td>
              <Td><b className="Family text-center text-xs block">14(s²p²)</b></Td>
              <Td><b className="Family text-center text-xs block">15(s²p³)</b></Td>
              <Td><b className="Family text-center text-xs block">16(s²p⁴)</b></Td>
              <Td><b className="Family text-center text-xs block">17(s²p⁵)</b></Td>
              <Td><b className="Family text-center text-xs block">18(s²p⁶)</b></Td>
            </tr>
            {ROWS.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  if (!cell) return <Td key={ci}/>;
                  if ('type' in cell && cell.type === "label") return <Td key={ci}><b className="Family text-center text-xs block">{cell.text}</b></Td>;
                  if ('type' in cell && cell.type === "period") return <Td key={ci}><small className="periodNumbers"><sub>{cell.num}</sub></small></Td>;
                  if ('type' in cell) return <Td key={ci}/>;
                  const isHighlight = highlightId === String(cell.id);
                  const isSelected = selecionadoId === String(cell.id);
                  return (
                    <td
                      key={ci}
                      className={`tdBorder ${cell.cls} ${isHighlight ? "highlight" : ""}`}
                      data-period={cell.period}
                      data-group={cell.group}
                      data-valence={cell.valence}
                      data-id={cell.id}
                      onClick={(e) => {
                        if (!elementoConfirmado && estado?.status !== "aguardando")
                          alternarSelecao(e.currentTarget as HTMLElement, String(cell.id));
                      }}
                      style={{ cursor: elementoConfirmado ? "default" : "pointer" }}
                    >
                      <span className="text-center block text-xs">{cell.id}</span>
                      <b className="text-center block text-sm">{cell.symbol}</b>
                      <small className="text-center block text-xs leading-tight">{cell.name}</small>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seleção atual */}
      {!finalizada && (
        <div className="px-4 pb-2 flex flex-col items-center gap-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 w-full max-w-3xl flex items-center justify-between gap-4">
            <div>
              <span className="font-semibold text-sm">Selecionado: </span>
              <span className="text-sm">{selecionadoId ? `Elemento #${selecionadoId}` : "Nenhum"}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={limparSelecao}
                disabled={!selecionadoId || elementoConfirmado}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Desmarcar
              </button>
              <button
                onClick={confirmarSelecao}
                disabled={!selecionadoId || elementoConfirmado || estado?.status === "aguardando"}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {elementoConfirmado ? "✅ Confirmado" : "Confirmar Seleção"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Painel inferior */}
      <div className="flex flex-col md:flex-row gap-4 p-4 justify-around">
        {/* Buscar elemento */}
        <div className="bg-amber-50 rounded-xl p-4 flex-1 max-w-md shadow">
          <h2 className="text-center font-semibold text-lg mb-3">Informe a Distribuição Eletrônica</h2>
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
            Buscar Elemento
          </button>
          {searchErro && <p className="text-red-600 text-xs mt-2">{searchErro}</p>}
        </div>

        {/* Dicas / Estado */}
        <div className="bg-amber-50 rounded-xl p-4 flex-1 max-w-lg shadow">
          <h2 className="text-center font-semibold text-lg mb-3">Status da Partida</h2>
          <div style={{ background: "rgb(228,209,187)", borderRadius: "7px", padding: "12px", minHeight: "120px" }}>
            {!estado ? (
              <p className="text-gray-500 text-sm">Carregando...</p>
            ) : estado.status === "aguardando" ? (
              <div className="text-center">
                <p className="font-semibold text-lg mb-2">🔑 ID da sua sala:</p>
                <p className="text-4xl font-bold text-blue-700 mb-2">{estado.id_jogada}</p>
                <p className="text-sm text-gray-600">Compartilhe este ID com o adversário para ele entrar na sala.</p>
              </div>
            ) : estado.status === "em_andamento" ? (
              <div>
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-xs font-semibold text-blue-700">{estado.jogador1?.nome}</p>
                    <p className="text-2xl mt-1">{estado.id_elemento1 ? "✅" : "⏳"}</p>
                    <p className="text-xs text-gray-500">{estado.id_elemento1 ? "Escolheu" : "Escolhendo..."}</p>
                  </div>
                  <div className="flex items-center text-gray-400 font-bold">VS</div>
                  <div>
                    <p className="text-xs font-semibold text-green-700">{estado.jogador2?.nome}</p>
                    <p className="text-2xl mt-1">{estado.id_elemento2 ? "✅" : "⏳"}</p>
                    <p className="text-xs text-gray-500">{estado.id_elemento2 ? "Escolheu" : "Escolhendo..."}</p>
                  </div>
                </div>
                {meuElemento && (
                  <div className="mt-3 pt-3 border-t border-amber-300">
                    <p className="text-xs font-semibold mb-1">Seu elemento escolhido:</p>
                    <p className="font-bold">{meuElemento.nome} <span className="font-normal text-sm text-gray-600">— {meuElemento.familia}</span></p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Td({ children }: { children?: React.ReactNode }) {
  return <td style={{ width: 60, height: 60 }}>{children}</td>;
}

// Tabela periódica completa
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
    { type:"label", text:"3(d¹)" },
    { type:"label", text:"4(d²)" },
    { type:"label", text:"5(d³)" },
    { type:"label", text:"6(d⁴)" },
    { type:"label", text:"7(d⁵)" },
    { type:"label", text:"8(d⁶)" },
    { type:"label", text:"9(d⁷)" },
    { type:"label", text:"10(d⁸)" },
    { type:"label", text:"11(d⁹)" },
    { type:"label", text:"12(d¹⁰)" },
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
