export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { idJogador, idJogada } = await req.json()

  if (!idJogador || !idJogada) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  // Verificar se a partida existe e está aguardando
  const { data: partida, error: fetchError } = await supabase
    .from('jogada')
    .select('id_jogada, id_jogador1, id_jogador2, status')
    .eq('id_jogada', idJogada)
    .single()

  if (fetchError || !partida) {
    return NextResponse.json({ error: 'Sala não encontrada' }, { status: 404 })
  }

  if (partida.status !== 'aguardando') {
    return NextResponse.json({ error: 'Sala já preenchida ou finalizada' }, { status: 409 })
  }

  if (partida.id_jogador1 === idJogador) {
    return NextResponse.json({ error: 'Você é o criador desta sala' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('jogada')
    .update({ id_jogador2: idJogador, status: 'em_andamento' })
    .eq('id_jogada', idJogada)
    .eq('status', 'aguardando')
    .select('id_jogada, status')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Não foi possível entrar na sala' }, { status: 500 })
  }

  return NextResponse.json(data)
}
