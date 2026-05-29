import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          status: 'aguardando' | 'em_andamento' | 'finalizada'
          vencedor: number | null
          criado_em: string
        }
        Insert: {
          id_jogador1: number
          id_jogador2?: number | null
          id_elemento1?: number | null
          id_elemento2?: number | null
          status?: 'aguardando' | 'em_andamento' | 'finalizada'
        }
        Update: {
          id_jogador2?: number | null
          id_elemento1?: number | null
          id_elemento2?: number | null
          status?: 'aguardando' | 'em_andamento' | 'finalizada'
          vencedor?: number | null
        }
      }
      dica: {
        Row: {
          id_dica: number
          elemento: string
          familia: string
          descricao_dica: string
        }
        Insert: {
          elemento: string
          familia: string
          descricao_dica: string
        }
        Update: {
          elemento?: string
          familia?: string
          descricao_dica?: string
        }
      }
    }
  }
}
