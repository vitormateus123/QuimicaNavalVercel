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
          palpite1: number | null
          palpite2: number | null
          acertou1: boolean | null
          acertou2: boolean | null
          status: 'aguardando' | 'em_andamento' | 'adivinhando' | 'finalizada'
          vencedor: number | null
          criado_em: string
        }
        Insert: {
          id_jogador1: number
          id_jogador2?: number | null
          id_elemento1?: number | null
          id_elemento2?: number | null
          palpite1?: number | null
          palpite2?: number | null
          acertou1?: boolean | null
          acertou2?: boolean | null
          status?: 'aguardando' | 'em_andamento' | 'adivinhando' | 'finalizada'
        }
        Update: {
          id_jogador2?: number | null
          id_elemento1?: number | null
          id_elemento2?: number | null
          palpite1?: number | null
          palpite2?: number | null
          acertou1?: boolean | null
          acertou2?: boolean | null
          status?: 'aguardando' | 'em_andamento' | 'adivinhando' | 'finalizada'
          vencedor?: number | null
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
