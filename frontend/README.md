# Atlas — frontend

Base de frontend em React + TypeScript + Vite, organizada para crescer num único site e domínio. A interface está em português de Portugal; os nomes técnicos permanecem em inglês para manter convenções consistentes no código.

## Áreas incluídas

- **Landing page** em `/`, com apresentação do produto e navegação pública.
- **Páginas legais** em `/termos` e `/privacidade`.
- **Autenticação** em `/auth`, com login, registo, validação por schema, sessão persistida e mensagens de erro normalizadas.
- **Área protegida** em `/app`, como ponto de extensão para as próximas funcionalidades.

## Estrutura

```text
src/
├── (default)/
│   ├── authentication/   # API, sessão, provider, hooks e formulários
│   ├── landing/          # conteúdo da página pública
│   ├── legal/            # layout e documentos legais
│   └── workspace/        # primeira rota protegida
├── components/           # componentes UI e componentes partilhados
├── lib/                  # cliente HTTP, erros, queries e utilitários
└── router/               # caminhos, rotas guest e rotas protegidas
```

A divisão por área mantém a lógica de negócio junto da funcionalidade e deixa os componentes partilhados independentes de uma implementação específica da API.

## Configuração

Copie `.env.example` para `.env.local` e ajuste a URL da API:

```bash
cp .env.example .env.local
```

Por defeito, o frontend utiliza `/api`, permitindo servir frontend e API no mesmo domínio através de reverse proxy. Para desenvolvimento separado, use por exemplo `VITE_API_BASE_URL=http://localhost:8080`.

## Desenvolvimento e validação

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Comandos de qualidade:

```bash
pnpm type-check
pnpm build
pnpm check
```

O build utiliza `React.lazy` para dividir o código por rota e evitar carregar páginas legais, autenticação e área protegida no bundle inicial. O router usa `BrowserRouter`, pelo que o servidor deve redirecionar pedidos de rotas desconhecidas para `index.html`.

## Integração de autenticação

A sessão é restaurada a partir de `localStorage`, validada através de `/auth/me` e ligada ao cliente Axios por um `TokenProvider`. Respostas 401 fora dos endpoints de autenticação limpam a sessão e fazem o router protegido regressar a `/auth`.

A API esperada é:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`

As respostas seguem o envelope `data` já usado pelos tipos da aplicação.
