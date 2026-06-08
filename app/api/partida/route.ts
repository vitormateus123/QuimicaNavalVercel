export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const idJogada = searchParams.get('idJogada')

  if (!idJogada) {
    return NextResponse.json({ error: 'idJogada é obrigatório' }, { status: 400 })
  }

  // 1. Busca a jogada com dados básicos (sem tentar navegar FK reversa para dicas)
  const { data: partida, error } = await supabase
    .from('jogada')
    .select(`
      id_jogada,
      status,
      id_jogador1,
      id_jogador2,
      id_elemento1,
      id_elemento2,
      vencedor,
      vez_de,
      jogador1:jogador!jogada_id_jogador1_fkey(nome),
      jogador2:jogador!jogada_id_jogador2_fkey(nome),
      elemento1:elemento!jogada_id_elemento1_fkey(id_elemento, nome, familia),
      elemento2:elemento!jogada_id_elemento2_fkey(id_elemento, nome, familia)
    `)
    .eq('id_jogada', idJogada)
    .single()

  if (error || !partida) {
    return NextResponse.json({ error: 'Partida não encontrada' }, { status: 404 })
  }

  // 2. Busca dicas separadamente via query direta na tabela dica
  //    (o join reverso elemento→dica não funciona no Supabase PostgREST)
  let dicasElemento1: { descricao: string }[] = []
  let dicasElemento2: { descricao: string }[] = []

  if (partida.id_elemento1) {
    const { data } = await supabase
      .from('dica')
      .select('descricao')
      .eq('id_elemento', partida.id_elemento1)
    dicasElemento1 = data ?? []
  }

  if (partida.id_elemento2) {
    const { data } = await supabase
      .from('dica')
      .select('descricao')
      .eq('id_elemento', partida.id_elemento2)
    dicasElemento2 = data ?? []
  }

  return NextResponse.json({
    ...partida,
    dicas_elemento1: dicasElemento1,
    dicas_elemento2: dicasElemento2,
  })
}
