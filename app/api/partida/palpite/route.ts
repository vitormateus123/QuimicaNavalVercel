export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { idJogador, idJogada, idPalpite } = await req.json()

  if (!idJogador || !idJogada || !idPalpite) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const { data: partida, error: fetchError } = await supabase
    .from('jogada')
    .select('id_jogador1, id_jogador2, id_elemento1, id_elemento2, status, vez_de')
    .eq('id_jogada', idJogada)
    .single()

  if (fetchError || !partida) {
    return NextResponse.json({ error: 'Partida não encontrada' }, { status: 404 })
  }

  if (partida.status !== 'adivinhando') {
    return NextResponse.json({ error: 'Fora do momento de adivinhação' }, { status: 409 })
  }

  const ehJogador1 = partida.id_jogador1 === idJogador
  const ehJogador2 = partida.id_jogador2 === idJogador

  if (!ehJogador1 && !ehJogador2) {
    return NextResponse.json({ error: 'Jogador não pertence a esta partida' }, { status: 403 })
  }

  if (partida.vez_de !== idJogador) {
    return NextResponse.json({ error: 'Não é a sua vez' }, { status: 409 })
  }

  // Cada jogador adivinha o elemento do adversário
  const elementoAlvo = ehJogador1 ? partida.id_elemento2 : partida.id_elemento1
  const acertou = Number(idPalpite) === Number(elementoAlvo)

  const updateData: Record<string, unknown> = {
    [ehJogador1 ? 'palpite1' : 'palpite2']: idPalpite,
    [ehJogador1 ? 'acertou1' : 'acertou2']: acertou,
  }

  if (acertou) {
    updateData.status = 'finalizada'
    updateData.vencedor = idJogador
  } else {
    // Passa a vez para o adversário
    updateData.vez_de = ehJogador1 ? partida.id_jogador2 : partida.id_jogador1
  }

  const { error: updateError } = await supabase
    .from('jogada')
    .update(updateData)
    .eq('id_jogada', idJogada)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, acertou, status: updateData.status ?? 'adivinhando' })
}
