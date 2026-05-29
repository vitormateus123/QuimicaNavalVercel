export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const idJogada = searchParams.get('idJogada')

  if (!idJogada) {
    return NextResponse.json({ error: 'idJogada é obrigatório' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('jogada')
    .select(`
      id_jogada,
      status,
      id_jogador1,
      id_jogador2,
      id_elemento1,
      id_elemento2,
      jogador1:jogador!jogada_id_jogador1_fkey(nome),
      jogador2:jogador!jogada_id_jogador2_fkey(nome),
      dica1:dica!jogada_id_elemento1_fkey(id_dica, elemento, familia, descricao_dica),
      dica2:dica!jogada_id_elemento2_fkey(id_dica, elemento, familia, descricao_dica)
    `)
    .eq('id_jogada', idJogada)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Partida não encontrada' }, { status: 404 })
  }

  return NextResponse.json(data)
}
