export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const idJogador = Number(body.idJogador)
  const idJogada  = Number(body.idJogada)
  const idElemento = Number(body.idElemento)

  if (!idJogador || !idJogada || !idElemento) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  // Verifica se o elemento existe
  const { data: elemento, error: elemError } = await supabase
    .from('elemento')
    .select('id_elemento')
    .eq('id_elemento', idElemento)
    .single()

  if (elemError || !elemento) {
    return NextResponse.json({ error: 'Elemento não encontrado' }, { status: 404 })
  }

  // Busca a partida atual
  const { data: partida, error: fetchError } = await supabase
    .from('jogada')
    .select('id_jogador1, id_jogador2, id_elemento1, id_elemento2, status')
    .eq('id_jogada', idJogada)
    .single()

  if (fetchError || !partida) {
    return NextResponse.json({ error: 'Partida não encontrada' }, { status: 404 })
  }

  if (partida.status !== 'em_andamento') {
    return NextResponse.json({ error: 'Fora do momento de escolha' }, { status: 409 })
  }

  // Identifica qual campo pertence a este jogador
  let campoElemento: 'id_elemento1' | 'id_elemento2'
  let elementoAdversario: number | null

  if (partida.id_jogador1 === idJogador) {
    if (partida.id_elemento1 !== null) {
      return NextResponse.json({ error: 'Você já escolheu seu elemento' }, { status: 409 })
    }
    campoElemento = 'id_elemento1'
    elementoAdversario = partida.id_elemento2
  } else if (partida.id_jogador2 === idJogador) {
    if (partida.id_elemento2 !== null) {
      return NextResponse.json({ error: 'Você já escolheu seu elemento' }, { status: 409 })
    }
    campoElemento = 'id_elemento2'
    elementoAdversario = partida.id_elemento1
  } else {
    return NextResponse.json({ error: 'Jogador não pertence a esta partida' }, { status: 403 })
  }

  // Monta o update
  const updateData: Record<string, unknown> = { [campoElemento]: idElemento }

  // Se o adversário já escolheu, ambos estão prontos — inicia fase de adivinhação
  if (elementoAdversario !== null && elementoAdversario !== undefined) {
    updateData.status = 'adivinhando'
    // jogador1 sempre começa a adivinhar
    updateData.vez_de = partida.id_jogador1
  }

  const { error: updateError } = await supabase
    .from('jogada')
    .update(updateData)
    .eq('id_jogada', idJogada)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    status: updateData.status ?? 'em_andamento',
  })
}
