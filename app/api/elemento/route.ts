export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { idJogador, idJogada, idElemento } = await req.json()

  if (!idJogador || !idJogada || !idElemento) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

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

  // Identifica qual campo salvar e valida se já escolheu
  let updateField: 'id_elemento1' | 'id_elemento2'
  let outroElemento: number | null

  if (partida.id_jogador1 === idJogador) {
    if (partida.id_elemento1) return NextResponse.json({ error: 'Você já escolheu seu elemento' }, { status: 409 })
    updateField = 'id_elemento1'
    outroElemento = partida.id_elemento2
  } else if (partida.id_jogador2 === idJogador) {
    if (partida.id_elemento2) return NextResponse.json({ error: 'Você já escolheu seu elemento' }, { status: 409 })
    updateField = 'id_elemento2'
    outroElemento = partida.id_elemento1
  } else {
    return NextResponse.json({ error: 'Jogador não pertence a esta partida' }, { status: 403 })
  }

  // Monta o update
  const updateData: Record<string, unknown> = { [updateField]: idElemento }

  // Se o adversário já escolheu, ambos estão prontos — inicia fase de palpites
  if (outroElemento !== null && outroElemento !== undefined) {
    updateData.status = 'adivinhando'
    updateData.vez_de = partida.id_jogador1  // jogador1 sempre começa
  }

  const { error: updateError } = await supabase
    .from('jogada')
    .update(updateData)
    .eq('id_jogada', idJogada)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, status: updateData.status ?? 'em_andamento' })
}
