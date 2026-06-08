export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/partida → lista salas abertas (status = 'aguardando')
export async function GET(_req: NextRequest) {
  const { data, error } = await supabase
    .from('jogada')
    .select(`
      id_jogada,
      id_jogador1,
      status,
      jogador1:jogador!jogada_id_jogador1_fkey(nome)
    `)
    .eq('status', 'aguardando')
    .order('id_jogada', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

// POST /api/partida → cria nova sala
export async function POST(req: NextRequest) {
  const body = await req.json()
  const idJogador = Number(body.idJogador)

  if (!idJogador) {
    return NextResponse.json({ error: 'idJogador é obrigatório' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('jogada')
    .insert({ id_jogador1: idJogador, status: 'aguardando' })
    .select('id_jogada')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Erro ao criar partida' }, { status: 500 })
  }

  return NextResponse.json({ id_jogada: data.id_jogada })
}
