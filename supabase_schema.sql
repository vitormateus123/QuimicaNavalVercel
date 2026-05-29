-- ============================================================
-- QUÍMICA NAVAL — Schema para Supabase
-- Execute este SQL no SQL Editor do Supabase
-- ============================================================

-- Tabela de dicas (elementos com informações pedagógicas)
CREATE TABLE IF NOT EXISTS dica (
  id_dica       SERIAL PRIMARY KEY,
  elemento      VARCHAR(100) NOT NULL,
  familia       VARCHAR(50)  NOT NULL,
  descricao_dica VARCHAR(500) NOT NULL
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
  id_jogador2  INTEGER REFERENCES jogador(id_jogador),
  id_elemento1 INTEGER REFERENCES dica(id_dica),
  id_elemento2 INTEGER REFERENCES dica(id_dica),
  status       VARCHAR(20) NOT NULL DEFAULT 'aguardando'
               CHECK (status IN ('aguardando', 'em_andamento', 'finalizada')),
  vencedor     INTEGER REFERENCES jogador(id_jogador),
  criado_em    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Habilitar Row Level Security (RLS)
-- ============================================================
ALTER TABLE dica    ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogador ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogada  ENABLE ROW LEVEL SECURITY;

-- Políticas: acesso público anônimo (para funcionar com anon key)
CREATE POLICY "Permitir leitura de dicas"       ON dica    FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de jogadores"   ON jogador FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de jogadores"  ON jogador FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de jogadas"     ON jogada  FOR SELECT USING (true);
CREATE POLICY "Permitir inserção de jogadas"    ON jogada  FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de jogadas" ON jogada  FOR UPDATE USING (true);

-- ============================================================
-- Dados de dicas (elementos da tabela periódica)
-- id_dica corresponde ao número atômico do elemento
-- ============================================================
INSERT INTO dica (id_dica, elemento, familia, descricao_dica) VALUES
(1,  'Hidrogênio', 'Não-metais',              'Elemento mais abundante do universo. Forma água (H₂O) e combustíveis. Distribuição eletrônica: 1s¹.'),
(2,  'Hélio',      'Gases nobres',             'Segundo elemento mais abundante. Usado em balões e mergulho. Distribuição eletrônica: 1s².'),
(3,  'Lítio',      'Metais alcalinos',         'Metal leve usado em baterias recarregáveis. Distribuição eletrônica: [He] 2s¹.'),
(4,  'Berílio',    'Metais alcalino-terrosos',  'Metal leve e resistente, usado em ligas aeroespaciais. Distribuição eletrônica: [He] 2s².'),
(5,  'Boro',       'Semimetais',               'Semicondutor natural, presente em bórax. Distribuição eletrônica: [He] 2s² 2p¹.'),
(6,  'Carbono',    'Não-metais',               'Base da vida orgânica. Forma diamante, grafite e fulerenos. Distribuição eletrônica: [He] 2s² 2p².'),
(7,  'Nitrogênio', 'Não-metais',               'Compõe 78% do ar atmosférico. Essencial para aminoácidos. Distribuição eletrônica: [He] 2s² 2p³.'),
(8,  'Oxigênio',   'Não-metais',               'Essencial para respiração e combustão. 21% da atmosfera. Distribuição eletrônica: [He] 2s² 2p⁴.'),
(9,  'Flúor',      'Halogênios',               'Elemento mais eletronegativo. Presente no flúor dentário. Distribuição eletrônica: [He] 2s² 2p⁵.'),
(10, 'Neônio',     'Gases nobres',             'Gás nobre usado em letreiros luminosos. Distribuição eletrônica: [He] 2s² 2p⁶.'),
(11, 'Sódio',      'Metais alcalinos',         'Metal reativo com água. Presente no sal de cozinha (NaCl). Distribuição eletrônica: [Ne] 3s¹.'),
(12, 'Magnésio',   'Metais alcalino-terrosos',  'Presente na clorofila e em ligas leves. Distribuição eletrônica: [Ne] 3s².'),
(13, 'Alumínio',   'Outros metais',            'Metal mais abundante da crosta terrestre. Leve e resistente. Distribuição eletrônica: [Ne] 3s² 3p¹.'),
(14, 'Silício',    'Semimetais',               'Base da indústria de semicondutores. Presente em areia. Distribuição eletrônica: [Ne] 3s² 3p².'),
(15, 'Fósforo',    'Não-metais',               'Essencial para DNA e ATP. Presente em fertilizantes. Distribuição eletrônica: [Ne] 3s² 3p³.'),
(16, 'Enxofre',    'Não-metais',               'Usado na produção de ácido sulfúrico. Presente em proteínas. Distribuição eletrônica: [Ne] 3s² 3p⁴.'),
(17, 'Cloro',      'Halogênios',               'Usado para desinfetar água. Forma o sal de cozinha com sódio. Distribuição eletrônica: [Ne] 3s² 3p⁵.'),
(18, 'Argônio',    'Gases nobres',             'Gás inerte usado em soldagem e lâmpadas. Distribuição eletrônica: [Ne] 3s² 3p⁶.'),
(19, 'Potássio',   'Metais alcalinos',         'Essencial para o funcionamento de nervos e músculos. Distribuição eletrônica: [Ar] 4s¹.'),
(20, 'Cálcio',     'Metais alcalino-terrosos',  'Principal componente de ossos e dentes. Distribuição eletrônica: [Ar] 4s².'),
(26, 'Ferro',      'Metais de transição',      'Metal mais usado pelo ser humano. Base do aço. Distribuição eletrônica: [Ar] 3d⁶ 4s².'),
(29, 'Cobre',      'Metais de transição',      'Excelente condutor elétrico. Usado em fios e moedas. Distribuição eletrônica: [Ar] 3d¹⁰ 4s¹.'),
(30, 'Zinco',      'Metais de transição',      'Usado para galvanizar metais. Essencial para o sistema imunológico. Distribuição eletrônica: [Ar] 3d¹⁰ 4s².'),
(47, 'Prata',      'Metais de transição',      'Melhor condutor elétrico e térmico. Propriedades antimicrobianas. Distribuição eletrônica: [Kr] 4d¹⁰ 5s¹.'),
(79, 'Ouro',       'Metais de transição',      'Metal precioso, excelente condutor, resistente à oxidação. Distribuição eletrônica: [Xe] 4f¹⁴ 5d¹⁰ 6s¹.'),
(80, 'Mercúrio',   'Metais de transição',      'Único metal líquido à temperatura ambiente. Muito tóxico. Distribuição eletrônica: [Xe] 4f¹⁴ 5d¹⁰ 6s².')
ON CONFLICT (id_dica) DO NOTHING;

-- Resetar a sequência para não conflitar com ids manuais
SELECT setval('dica_id_dica_seq', (SELECT MAX(id_dica) FROM dica));
