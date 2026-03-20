# FiscalTech Tracking App

Portal web para consulta e confirmacao de recebimento de romaneios, com integracao
server-side com o Protheus.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- API Rest
- Sql Server

## Executando localmente

1. Configure as variaveis no arquivo `.env.local`:

```env
PROTHEUS_REST_URL=http://seu-servidor:8087/rest
PROTHEUS_REST_USER=usuario
PROTHEUS_REST_PASS=senha
```

2. Inicie o projeto:

```bash
npm run dev
```

3. Acesse `http://localhost:3000?token=SEU_TOKEN`.

## Estrutura

```text
app/
  api/
    confirm/route.ts     -> confirma o recebimento
    romaneio/route.ts    -> consulta os dados do romaneio
  layout.tsx             -> layout e metadata da aplicacao
  page.tsx               -> ponto de entrada da pagina

components/receipt/
  ...                    -> componentes visuais da jornada de confirmacao

hooks/
  use-receipt-flow.ts    -> estado e fluxo da tela principal

lib/
  server/                -> integracao com Protheus
  types/                 -> contratos do dominio
  utils/                 -> utilitarios puros
```
