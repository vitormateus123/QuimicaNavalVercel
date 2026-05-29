# 🚢 Química Naval — Guia de Deploy

## Stack
- **Frontend + API**: Next.js 16 (App Router) → Vercel
- **Banco de dados**: Supabase (PostgreSQL + Realtime)

---

## 1. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** e execute o arquivo `supabase_schema.sql` (cria as tabelas, políticas RLS e dados iniciais)
3. Copie as credenciais em **Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Deploy na Vercel

### Via CLI (recomendado):
```bash
npm i -g vercel
vercel login
vercel --prod
```
Quando solicitado, configure as variáveis de ambiente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Via Dashboard:
1. Faça push para GitHub
2. Importe o repositório em [vercel.com](https://vercel.com/new)
3. Em **Environment Variables**, adicione as duas variáveis acima
4. Clique em **Deploy**

---

## 3. Desenvolvimento local

```bash
# Clone e instale
npm install

# Crie o arquivo de variáveis locais
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:3000
```

---

## 4. Fluxo do jogo

```
Jogador A                    Jogador B
   │                            │
   ├─ Entra com nome            ├─ Entra com nome
   ├─ Cria sala (obtém ID)      │
   │                            ├─ Entra na sala pelo ID
   ├─ Escolhe elemento ─────────┤
   │                            ├─ Escolhe elemento
   │                            │
   └────── Partida Finalizada ──┘
           (ambos os elementos são revelados)
```

---

## 5. Estrutura do projeto

```
quimica-naval/
├── app/
│   ├── page.tsx              # Login (entrada de nome)
│   ├── sala/page.tsx         # Lobby (criar/entrar em sala)
│   ├── jogo/page.tsx         # Jogo (tabela periódica interativa)
│   ├── api/
│   │   ├── jogador/route.ts  # POST: criar jogador
│   │   ├── partida/
│   │   │   ├── route.ts      # GET: listar salas | POST: criar partida
│   │   │   ├── entrar/       # POST: entrar em partida
│   │   │   └── estado/       # GET: estado atual (polling)
│   │   └── elemento/route.ts # POST: confirmar elemento escolhido
├── lib/supabase.ts           # Client Supabase + tipos
├── supabase_schema.sql       # SQL completo para o Supabase
├── vercel.json               # Configuração da Vercel
└── .env.example              # Variáveis de ambiente necessárias
```

---

## 6. Possíveis expansões futuras

- **Realtime com Supabase Channels**: substituir o polling por WebSockets
- **Sistema de pontuação**: registrar histórico de vitórias por jogador
- **Mais elementos com dicas**: expandir a tabela `dica` com todos os 118 elementos
- **Modo de adivinhar**: ao invés de escolher e revelar, implementar o modo "batalha naval" onde um jogador tenta adivinhar o elemento do outro
