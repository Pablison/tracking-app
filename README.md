# FiscalTech Tracking App

Portal web para consulta e confirmacao de recebimento de romaneios, com integracao
server-side com o Protheus.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4

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

## Decisoes de refatoracao

- A integracao com o ERP foi centralizada em `lib/server/protheus-client.ts`.
- A sanitizacao de token e a formatacao de data foram extraidas para utilitarios.
- `app/page.tsx` deixou de concentrar regra, layout e efeitos colaterais.
- A tela foi quebrada em componentes menores, com responsabilidades explicitas.
- As rotas de API agora validam entrada e delegam a logica de infraestrutura.

## Proximos passos recomendados

- Adicionar testes para `sanitizeToken`, `formatDeliveryDate` e rotas de API.
- Criar validacao estruturada de payload com Zod ou schema equivalente.
- Mapear mensagens de erro do Protheus para mensagens de negocio mais claras.
- Considerar observabilidade minima nas rotas com logs padronizados.
