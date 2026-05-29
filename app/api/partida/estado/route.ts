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
      palpite1,
      palpite2,
      acertou1,
      acertou2,
      vencedor,
      vez_de,
      jogador1:jogador!jogada_id_jogador1_fkey(nome),
      jogador2:jogador!jogada_id_jogador2_fkey(nome),
      elemento1:elemento!jogada_id_elemento1_fkey(id_elemento, nome, familia),
      elemento2:elemento!jogada_id_elemento2_fkey(id_elemento, nome, familia),
      dicas_elemento1:elemento!jogada_id_elemento1_fkey(dica(descricao)),
      dicas_elemento2:elemento!jogada_id_elemento2_fkey(dica(descricao))
    `)
    .eq('id_jogada', idJogada)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Partida não encontrada' }, { status: 404 })
  }

  return NextResponse.json(data)
}
