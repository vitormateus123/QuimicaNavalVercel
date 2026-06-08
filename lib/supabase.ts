import { createClient } from '@supabase/supabase-js'

// Factory: cria o cliente lendo as variáveis no momento da chamada,
// evitando o problema de singleton instanciado com placeholder quando
// o processo Node reutiliza o módulo antes das envs estarem disponíveis.
function criarSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas.'
    )
  }

  return createClient(url, key)
}

// Exporta o cliente como getter — cada módulo que importa `supabase`
// recebe uma instância válida, instanciada com as envs reais.
export const supabase = criarSupabase()

export type Database = {
  public: {
    Tables: {
      jogador: {
        Row: { id_jogador: number; nome: string; criado_em: string }
        Insert: { nome: string }
        Update: { nome?: string }
      }
      jogada: {
        Row: {
          id_jogada: number
          id_jogador1: number
          id_jogador2: number | null
          id_elemento1: number | null
          id_elemento2: number | null
          status: 'aguardando' | 'em_andamento' | 'adivinhando' | 'finalizada'
          vencedor: number | null
          vez_de: number | null
          criado_em: string
        }
        Insert: {
          id_jogador1: number
          id_jogador2?: number | null
          id_elemento1?: number | null
          id_elemento2?: number | null
          status?: 'aguardando' | 'em_andamento' | 'adivinhando' | 'finalizada'
        }
        Update: {
          id_jogador2?: number | null
          id_elemento1?: number | null
          id_elemento2?: number | null
          status?: 'aguardando' | 'em_andamento' | 'adivinhando' | 'finalizada'
          vencedor?: number | null
          vez_de?: number | null
        }
      }
      elemento: {
        Row: { id_elemento: number; nome: string; familia: string }
        Insert: { nome: string; familia: string }
        Update: { nome?: string; familia?: string }
      }
      dica: {
        Row: { id_dica: number; id_elemento: number; descricao: string }
        Insert: { id_elemento: number; descricao: string }
        Update: { id_elemento?: number; descricao?: string }
      }
    }
  }
}
