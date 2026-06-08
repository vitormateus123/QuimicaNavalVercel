export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: criar partida
export async function POST(req: NextRequest) {
  const { idJogador } = await req.json()

  if (!idJogador) {
    return NextResponse.json({ error: 'idJogador é obrigatório' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('jogada')
    .insert({
      id_jogador1: idJogador,
      status: 'aguardando',
    })
    .select('id_jogada, status')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// GET: listar partidas abertas
export async function GET() {
  const { data, error } = await supabase
    .from('jogada')
    .select(`
      id_jogada,
      status,
      id_jogador1,
      jogador1:jogador!jogada_id_jogador1_fkey(nome)
    `)
    .eq('status', 'aguardando')
    .order('id_jogada', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
