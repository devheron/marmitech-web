# marmitech-web

Frontend do Marmitech, o sistema de pedidos com cardápio online e fila de atendimento. A API fica no repositório `marmitech-api`.

Separei do backend porque os dois seguem para serviços diferentes na nuvem. Aqui o build é estático e vai para o Firebase Hosting; a API roda em container no Cloud Run.

## Stack

- Angular 19 standalone
- MDB Angular UI Kit
- Chart.js para os gráficos do painel
- SweetAlert2 para os diálogos
- SCSS

## Rodando local

Precisa de Node 20 ou superior.

```bash
git clone https://github.com/<org>/marmitech-web.git
cd marmitech-web
npm install
npm start
```

A aplicação abre em `http://localhost:4200` e espera a API em `http://localhost:8080`. Suba o backend antes, senão as telas carregam vazias.

## Ambientes

A URL da API vem de `src/environments`. O Angular troca o arquivo automaticamente no build de produção.

| Arquivo | Quando é usado |
|---|---|
| `environment.ts` | `npm start` e build de desenvolvimento |
| `environment.prod.ts` | `npm run build` |

Antes de publicar, o `apiUrl` do `environment.prod.ts` precisa apontar para a URL do Cloud Run:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://marmitech-api-xxxxx.southamerica-east1.run.app'
};
```

Se esquecer disso, o build sobe apontando para `localhost` e nada funciona no ar. Já aconteceu, então vale conferir.

## Build

```bash
npm run build
```

A saída fica em `dist/marmitech-web/browser`. Esse `browser` no final é do builder novo do Angular 17 em diante e é justamente o caminho que o Firebase pede na configuração.

## Deploy no Firebase Hosting

```bash
npx firebase login
npx firebase init hosting
npx firebase deploy
```

Nas perguntas do `init`:

- Public directory: `dist/marmitech-web/browser`
- Single-page app: yes
- Overwrite index.html: no

O "yes" no single-page app importa. Sem isso, atualizar a página em qualquer rota que não seja a raiz devolve 404, porque o roteamento é do Angular e o servidor não conhece essas rotas.

Depois do primeiro deploy, pegue a URL gerada e coloque na variável `CORS_ORIGINS` do Cloud Run. Sem isso o navegador bloqueia as chamadas.

## Testes

```bash
npm test
```

Karma e Jasmine estão configurados, mas a cobertura hoje é praticamente zero. É dívida conhecida, não descuido.

## Branches

Git Flow. `main` espelha o que está publicado, `develop` é a integração, tudo entra por Pull Request com uma aprovação. O guia está em `docs/02-git-flow-equipe.md`.

Commits em Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`).

## Equipe

| Nome | Papel |
|---|---|
| Heron | Scrum Master |
| Jihad Ghozayel | Product Owner |
| Marina | Developer |
| Fabricio Quintana | Developer |
| João Rodrigues | Developer |
