-- ============================================================
-- QUÍMICA NAVAL — Schema para Supabase
-- Execute este SQL no SQL Editor do Supabase
-- ============================================================

-- Tabela de elementos (dados fixos do elemento)
CREATE TABLE IF NOT EXISTS elemento (
  id_elemento  SERIAL PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL UNIQUE,
  familia      VARCHAR(50)  NOT NULL
);

-- Tabela de dicas (múltiplas por elemento)
CREATE TABLE IF NOT EXISTS dica (
  id_dica      SERIAL PRIMARY KEY,
  id_elemento  INTEGER NOT NULL REFERENCES elemento(id_elemento) ON DELETE CASCADE,
  descricao    VARCHAR(1000) NOT NULL
);

-- Tabela de jogadores
CREATE TABLE IF NOT EXISTS jogador (
  id_jogador SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  criado_em  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de jogadas (partidas)
CREATE TABLE IF NOT EXISTS jogada (
  id_jogada    SERIAL PRIMARY KEY,
  id_jogador1  INTEGER NOT NULL REFERENCES jogador(id_jogador),
  id_jogador2  INTEGER          REFERENCES jogador(id_jogador),
  id_elemento1 INTEGER          REFERENCES elemento(id_elemento),
  id_elemento2 INTEGER          REFERENCES elemento(id_elemento),
  status       VARCHAR(20) NOT NULL DEFAULT 'aguardando'
               CHECK (status IN ('aguardando', 'em_andamento', 'finalizada')),
  vencedor     INTEGER          REFERENCES jogador(id_jogador),
  criado_em    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Habilitar Row Level Security (RLS)
-- ============================================================
ALTER TABLE elemento ENABLE ROW LEVEL SECURITY;
ALTER TABLE dica     ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogador  ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogada   ENABLE ROW LEVEL SECURITY;

-- Políticas: acesso público anônimo (para funcionar com anon key)
CREATE POLICY "Permitir leitura de elementos"    ON elemento FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de dicas"        ON dica     FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de jogadores"    ON jogador  FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de jogadores"   ON jogador  FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de jogadas"      ON jogada   FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de jogadas"     ON jogada   FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de jogadas"  ON jogada   FOR UPDATE USING (true);
