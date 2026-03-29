# Astro API

## Stack
- Runtime: Bun
- Framework: Elysia
- ORM: Drizzle ORM + drizzle-kit
- Database driver: pg (Pool)
- Language: TypeScript (strict)

## Estrutura
```
src/
  database/
    connection.ts     # pg Pool
    index.ts          # instância do drizzle
    schema/           # schemas do drizzle
    migrations/       # gerado pelo drizzle-kit
  plugins/            # plugins do Elysia organizados por categoria
    core/
      error-handler/
        error-handler.plugin.ts  # plugin Elysia com onError
        http-error.ts            # classe HttpError
        http-status.constants.ts # const HTTP_STATUS
    auth/             # jwt, session, etc
    infra/            # rate-limit, cors, etc
  modules/            # feature-based folders
    auth/
      auth.routes.ts
      auth.service.ts
      auth.repository.ts
      auth.schema.ts
      auth.types.ts
      auth.constants.ts
    users/
      users.routes.ts
      users.service.ts
      users.repository.ts
      users.schema.ts
      users.types.ts
      users.constants.ts
    modules.routes.ts  # agrega todas as rotas dos módulos via .use()
  configs/             # variáveis de ambiente centralizadas por domínio
    core.config.ts     # database, jwt, server port
  index.ts             # registra plugins e importa modules.routes.ts
```

## Documentação OpenAPI (Scalar)
- Plugin em `src/plugins/docs/swagger/swagger.plugin.ts` — usa `@elysiajs/swagger` com `provider: "scalar"`
- UI disponível em `/swagger` ao rodar o servidor
- Cada módulo tem um arquivo `<feature>.docs.ts` com os objetos `detail` das rotas (tags, summary, description, security, responses)
- Nos arquivos de rotas, fazer spread do schema + docs: `{ ...loginSchema, ...loginDocs }`
- Para rotas sem body/params, passar o docs diretamente como terceiro argumento

## Convenções de Módulos
- Cada feature fica em `src/modules/<feature>/`
- Arquivos nomeados com o padrão `<feature>.<tipo>.ts`
- Tipos válidos: `routes`, `service`, `repository`, `schema`, `types`, `constants`, `docs`
- Queries ao banco ficam exclusivamente no `repository` — o `service` nunca acessa `db` diretamente
- Rotas de cada módulo ficam em `<feature>.routes.ts`
- Todas as rotas de módulos são agregadas em `src/modules/modules.routes.ts`
- `src/index.ts` só registra plugins e importa `modules.routes.ts` — nunca rotas diretamente
- Plugins ficam em `src/plugins/<categoria>/<plugin>/` e também são registrados via `.use()`
- Cada arquivo tem responsabilidade única — sem misturar lógica de plugin, service, tipos e constants no mesmo arquivo
- Nunca usar `index.ts` dentro de pastas de plugins — nomear os arquivos explicitamente com o sufixo do tipo (`.plugin.ts`, `.constants.ts`, etc)
- `process.env` nunca é acessado diretamente nos módulos — sempre via `src/configs/<domínio>.config.ts`
- Cada config agrupa as env vars por domínio (database, jwt, server, etc)

## Tratamento de Erros
- Evitar `try/catch` — lançar erros diretamente
- Nunca lançar `new Error()` puro ou `new HttpError()` direto nos módulos
- Cada exception fica em `src/exceptions/<nome>.exception.ts` e encapsula o `HttpError`
- O plugin `error-handler` captura via `onError` e padroniza o response
- Exemplo de uso:
  ```ts
  throw new NotFoundException("User not found");
  ```
- Para criar uma nova exception, criar um arquivo em `src/exceptions/` seguindo o padrão existente

## Path Aliases
- `@/*` → `src/*`
- `@database/*` → `src/database/*`
- `@schema/*` → `src/database/schema/*`
- `@exceptions/*` → `src/exceptions/*`
- `@configs/*` → `src/configs/*`

## Code Style
- Prettier com padrão Google
- ESLint: apenas `no-unused-vars`
- Aspas duplas, ponto e vírgula, 2 espaços, 80 colunas

## Scripts
- `bun run dev` — inicia com hot reload
- `bun run lint` — valida código
- `bun run format` — formata com prettier
- `bun run format:check` — verifica formatação
- `bunx drizzle-kit generate` — gera migration
- `bunx drizzle-kit migrate` — aplica migration
