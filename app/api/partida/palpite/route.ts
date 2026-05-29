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

  // Verifica se é a vez deste jogador
  if (partida.vez_de !== idJogador) {
    return NextResponse.json({ error: 'Não é a sua vez' }, { status: 409 })
  }

  // Jogador1 adivinha id_elemento2, jogador2 adivinha id_elemento1
  const elementoAlvo = ehJogador1 ? partida.id_elemento2 : partida.id_elemento1
  const acertou = Number(idPalpite) === Number(elementoAlvo)

  const palpiteField = ehJogador1 ? 'palpite1' : 'palpite2'
  const acertouField = ehJogador1 ? 'acertou1' : 'acertou2'

  const updateData: Record<string, number | string | boolean | null> = {
    [palpiteField]: idPalpite,
    [acertouField]: acertou,
  }

  if (acertou) {
    // Acertou — finaliza a partida, este jogador venceu
    updateData.status = 'finalizada'
    updateData.vencedor = idJogador
  } else {
    // Errou — passa a vez para o adversário
    const adversario = ehJogador1 ? partida.id_jogador2 : partida.id_jogador1
    updateData.vez_de = adversario
    // Limpa o palpite anterior para o próximo turno (campo reaproveitado)
    updateData[palpiteField] = idPalpite   // mantém o último palpite para referência
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
    acertou,
    status: updateData.status ?? 'adivinhando',
    vezDe: updateData.vez_de ?? idJogador,
  })
}
