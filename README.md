# Monitoramento de Ramais

Dashboard em tempo real do status (online/offline) dos ramais registrados,
por unidade, consumindo a API da NextBilling.

## Como rodar

```bash
npm install
npm run dev
```

Sem configurar `.env.local`, o app já sobe funcionando com dados mock
(`lib/data/ramais-mock.ts`), pra dar pra desenvolver a UI sem depender da
API real. Quando tiver as credenciais:

```bash
cp .env.local.example .env.local
# preencher NEXTBILLING_BASE_URL / NEXTBILLING_API_TOKEN / NEXTBILLING_API_KEY
npm run dev
```

## Arquitetura

```
app/
  api/ramais/route.ts     -> Route Handler (BFF): único endpoint que o browser conhece
  page.tsx                -> monta o dashboard
  layout.tsx

components/
  dashboard/
    dashboard-ramais.tsx  -> UI (client component), consome o hook de polling

lib/
  types.ts                -> modelo de domínio da app (UnidadeRamaisStatus)
  hooks/
    use-ramais-status.ts  -> hook client-side (SWR), polling a cada 30s em /api/ramais
  data/
    ramais-mock.ts         -> dados de apoio pra desenvolvimento sem API real
  api/
    nextbilling-types.ts   -> tipos que espelham o payload cru da NextBilling
    nextbilling-client.ts  -> chamadas HTTP cruas à NextBilling (só roda no servidor)
    ramais-repository.ts   -> orquestra client + mock, agrega linhas -> status por unidade
```

**Por que essa separação:**

- O browser nunca fala com a NextBilling diretamente — só com `/api/ramais`,
  nossa própria rota. Isso mantém `NEXTBILLING_API_TOKEN`/`NEXTBILLING_API_KEY`
  só no servidor (reforçado em build-time pelo `import "server-only"` nos
  arquivos de `lib/api/`).
- `nextbilling-client.ts` (chamadas HTTP cruas) fica separado de
  `ramais-repository.ts` (regra de agregação: linhas -> total/online/offline).
  Se o formato da API mudar, o ajuste fica isolado num arquivo só.
- `lib/types.ts` é o modelo que a UI consome — não é o mesmo formato da
  NextBilling (`nextbilling-types.ts`). Isso desacopla a tela de como a
  NextBilling estrutura o retorno dela.
- Trocar dados mock por dados reais é só configurar o `.env.local` — o
  resto do código não muda.

## Fluxo de dados até a NextBilling

1. `GET /api/listCustomers/TOKEN/KEY` — lista as unidades (assinantes)
2. `GET /api/listDevicesRegistered/TOKEN/KEY/{id_cliente}` — uma chamada por
   unidade (em paralelo), retorna as linhas com `device_registered` (bool)
3. Agregação: `totalRamais` = nº de linhas, `ramaisOnline` = linhas com
   `device_registered = true`, `ramaisOffline` = o restante

## Pendências antes de ligar na API real

- `NEXTBILLING_BASE_URL` real da conta (a doc só mostra um exemplo)
- `NEXTBILLING_API_TOKEN` e `NEXTBILLING_API_KEY`
