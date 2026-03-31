# CLAUDE.md — React + TanStack Router

Guia de boas práticas para o agente de IA ao trabalhar neste projeto. Siga estas convenções rigorosamente ao gerar ou modificar código.

---

## Stack

- **Framework**: React 19
- **Roteamento**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query
- **Estilização**: Tailwind CSS
- **Linguagem**: TypeScript (strict)
- **Gerenciador de pacotes**: pnpm

---

## Estrutura de Pastas

```
src/
├── routes/                  # File-based routes (TanStack Router)
│   ├── __root.tsx
│   ├── index.tsx
│   └── dashboard/
│       ├── index.tsx
│       └── $id.tsx
├── components/
│   ├── ui/                  # Componentes genéricos (Button, Input, Modal...)
│   └── [feature]/           # Componentes específicos de uma feature
├── hooks/                   # Custom hooks reutilizáveis
├── services/                # Funções de comunicação com a API
├── queries/                 # Query keys e query/mutation factories (TanStack Query)
├── stores/                  # Estado global (Zustand ou similar), se necessário
├── lib/                     # Helpers, utils, clients HTTP
├── types/                   # Tipos e interfaces globais
└── styles/                  # CSS global, tokens
```

---

## Separação de Responsabilidades

### Regra geral

Cada arquivo deve ter **uma única responsabilidade**. Um componente não deve buscar dados, formatar lógica de negócio e renderizar ao mesmo tempo.

| Camada | Responsabilidade |
|---|---|
| `routes/` | Apenas composição de layout, loaders e `<Outlet />` |
| `components/` | Apenas renderização e UX local |
| `hooks/` | Lógica reutilizável, side effects, derivação de estado |
| `queries/` | Definição de queries/mutations (TanStack Query) |
| `services/` | Chamadas HTTP, sem lógica de UI |
| `lib/` | Funções puras, utilitários sem dependência de React |

### Exemplo correto

```tsx
// services/users.ts
export const fetchUser = (id: string): Promise<User> =>
  http.get(`/users/${id}`).then((r) => r.data)

// queries/users.ts
export const userQueries = {
  detail: (id: string) => ({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
  }),
}

// routes/users/$id.tsx
export const Route = createFileRoute('/users/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(userQueries.detail(params.id)),
  component: UserPage,
})

function UserPage() {
  const { id } = Route.useParams()
  const { data: user } = useSuspenseQuery(userQueries.detail(id))

  return <UserProfile user={user} />
}
```

---

## Tratamento de Erros — Evite try/catch

### Problema

`try/catch` espalhados pelo código criam inconsistência, silenciam erros e misturam camadas de responsabilidade.

### Abordagem correta

**Use `Result` types ou deixe os erros propagarem para os boundaries adequados.**

#### 1. Erros de servidor → Error Boundaries do TanStack Router

Configure `errorComponent` nas rotas para capturar erros de loader/query:

```tsx
// routes/dashboard/index.tsx
export const Route = createFileRoute('/dashboard/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(dashboardQueries.summary()),
  errorComponent: DashboardError,
  pendingComponent: DashboardSkeleton,
  component: DashboardPage,
})

function DashboardError({ error }: ErrorComponentProps) {
  return <ErrorState message={error.message} />
}
```

#### 2. Mutations — use `onError` do TanStack Query

```tsx
// Evite isso:
const handleSubmit = async () => {
  try {
    await createUser(data)
    toast.success('Criado!')
  } catch (err) {
    toast.error('Erro ao criar')
  }
}

// Prefira isso:
const { mutate: createUser } = useMutation({
  ...userMutations.create(),
  onSuccess: () => toast.success('Criado!'),
  onError: (error) => toast.error(error.message),
})

const handleSubmit = () => createUser(data)
```

#### 3. Erros esperados → tipo `Result`

Para lógica onde o erro é parte do fluxo (ex: validação), use um padrão `Result`:

```ts
// lib/result.ts
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

export const ok = <T>(value: T): Result<T> => ({ ok: true, value })
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error })
```

```ts
// services/auth.ts
export const login = async (credentials: Credentials): Promise<Result<User, AuthError>> => {
  const response = await http.post('/auth/login', credentials)

  if (response.status === 401) return err({ code: 'INVALID_CREDENTIALS' })
  if (!response.ok) return err({ code: 'SERVER_ERROR' })

  return ok(response.data)
}

// hook ou componente
const result = await login(credentials)
if (!result.ok) {
  setError(result.error.code)
  return
}
navigateTo('/dashboard')
```

#### 4. `try/catch` são permitidos apenas em

- Parsing de JSON onde o input é externo/desconhecido
- Operações com APIs de terceiros sem tipagem confiável
- O cliente HTTP base (`lib/http.ts`), centralizando o tratamento uma única vez

---

## TanStack Router — Boas Práticas

### Loaders para pre-fetching

Sempre use loaders para garantir que os dados estejam disponíveis antes da renderização. Não faça fetching dentro do componente da rota.

```tsx
// ✅ Correto
export const Route = createFileRoute('/products/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(productQueries.list()),
  component: ProductsPage,
})

// ❌ Errado — fetching dentro do componente da rota
function ProductsPage() {
  const { data } = useQuery(productQueries.list()) // evite
}
```

### `useSuspenseQuery` dentro das páginas

Após o loader garantir os dados, use `useSuspenseQuery` — ele nunca retorna `undefined` e elimina checagens de `isLoading`.

```tsx
function ProductsPage() {
  const { data: products } = useSuspenseQuery(productQueries.list())
  // `products` é sempre definido aqui
}
```

### Tipagem de Search Params

Sempre valide e tipe search params com `zodValidator` ou similar:

```tsx
import { zodValidator } from '@tanstack/zod-adapter'

const searchSchema = z.object({
  page: z.number().default(1),
  q: z.string().optional(),
})

export const Route = createFileRoute('/products/')({
  validateSearch: zodValidator(searchSchema),
  component: ProductsPage,
})

function ProductsPage() {
  const { page, q } = Route.useSearch()
}
```

### Navegação tipada

Sempre use `Link` e `useNavigate` do TanStack Router para garantir type-safety nas rotas.

```tsx
import { Link, useNavigate } from '@tanstack/react-router'

// Link declarativo
<Link to="/products/$id" params={{ id: product.id }}>Ver produto</Link>

// Navegação imperativa
const navigate = useNavigate()
navigate({ to: '/dashboard' })
```

### Context do Router para injeção de dependências

Use o `context` do router para injetar `queryClient` e outros serviços globais:

```tsx
// main.tsx
const router = createRouter({
  routeTree,
  context: { queryClient },
})

// Acesso no loader
export const Route = createFileRoute('/users/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(userQueries.list()),
})
```

---

## Componentes

### Regras

- Componentes devem ser **funções puras de renderização**. Lógica complexa vai em hooks.
- Prefira composição a herança e a props drilling excessivo.
- Componentes com mais de ~150 linhas são candidatos a divisão.
- Sempre exporte o componente como **named export** (não default), exceto nas rotas.

### Separação de lógica

```tsx
// ❌ Componente fazendo tudo
function UserForm() {
  const [name, setName] = useState('')
  const { mutate } = useMutation(...)
  const validate = () => { ... }
  const handleSubmit = async () => {
    if (!validate()) return
    try { await mutate(...) } catch { ... }
  }
  return <form>...</form>
}

// ✅ Lógica isolada em hook
function useUserForm() {
  const form = useForm({ ... })
  const { mutate, isPending } = useMutation({
    ...userMutations.create(),
    onSuccess: () => navigate({ to: '/users' }),
    onError: (e) => form.setError('root', { message: e.message }),
  })

  return { form, isPending, onSubmit: form.handleSubmit((data) => mutate(data)) }
}

function UserForm() {
  const { form, isPending, onSubmit } = useUserForm()
  return <form onSubmit={onSubmit}>...</form>
}
```

---

## Custom Hooks

- Nomeie sempre com prefixo `use`.
- Um hook deve ter **uma única responsabilidade**.
- Hooks não devem retornar JSX — isso é papel do componente.
- Prefira retornar um **objeto nomeado** em vez de array (exceto quando imitar `useState`).

```ts
// ✅
function useProductFilters() {
  const { page, q } = Route.useSearch()
  const navigate = useNavigate()

  const setPage = (page: number) => navigate({ search: (prev) => ({ ...prev, page }) })
  const setQuery = (q: string) => navigate({ search: (prev) => ({ ...prev, q, page: 1 }) })

  return { page, q, setPage, setQuery }
}
```

---

## Services & Queries

### Services (`services/`)

- Funções puras que fazem chamadas HTTP.
- Não importam nada do React.
- Sempre tipadas com retorno explícito.
- Não fazem tratamento de toast ou UI.

```ts
// services/products.ts
import { http } from '@/lib/http'
import type { Product, CreateProductDto } from '@/types/products'

export const fetchProducts = (): Promise<Product[]> =>
  http.get('/products').then((r) => r.data)

export const createProduct = (dto: CreateProductDto): Promise<Product> =>
  http.post('/products', dto).then((r) => r.data)
```

### Queries (`queries/`)

- Centralizam query keys e factories para TanStack Query.
- Seguem o padrão de objeto com métodos (`productQueries.list()`, `productQueries.detail(id)`).

```ts
// queries/products.ts
import { fetchProducts, fetchProduct } from '@/services/products'

export const productQueries = {
  all: () => ({ queryKey: ['products'] as const }),

  list: () => ({
    queryKey: [...productQueries.all().queryKey, 'list'] as const,
    queryFn: fetchProducts,
  }),

  detail: (id: string) => ({
    queryKey: [...productQueries.all().queryKey, 'detail', id] as const,
    queryFn: () => fetchProduct(id),
  }),
}

export const productMutations = {
  create: () => ({
    mutationFn: createProduct,
  }),
}
```

---

## TypeScript

- Nunca use `any`. Prefira `unknown` quando o tipo é incerto.
- Sempre tipar retornos de funções explicitamente em services e hooks.
- Use `satisfies` para validar objetos contra tipos sem perder o tipo literal.
- Evite type assertions (`as X`) — prefira type guards.

```ts
// Type guard
function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'code' in value
}
```

---

## Convenções de Código

- **Funções**: sempre arrow functions (`const fn = () => {}`)
- **Imports**: sempre com aliases de path (`@/components/...`)
- **Exports**: named exports em tudo, exceto componentes de rota (que exigem `export const Route`)
- **Nomes de arquivos**: `kebab-case` para arquivos, `PascalCase` para componentes
- **Constantes globais**: `SCREAMING_SNAKE_CASE`
- **Zero comentários no código** — veja a seção dedicada abaixo

---

## Zero Comentários no Código

**Não escreva comentários. Nunca. Nenhum.**

Isso inclui:

- Comentários de linha (`// ...`)
- Comentários de bloco (`/* ... */`)
- JSDoc (`/** ... */`)
- Comentários "TODO" ou "FIXME"
- Comentários explicando o que o código faz
- Comentários de seção (`// --- handlers ---`)

### Por quê

Comentários são uma muleta para código mal nomeado. Se você sente necessidade de comentar, o problema é o nome da variável, função ou o tamanho do bloco — não a falta de explicação.

```ts
// ❌ Errado — comentário explica o que o código já diz
// Busca o usuário pelo ID
const user = await fetchUser(id)

// ❌ Errado — nome ruim compensado com comentário
// Verifica se o token ainda é válido
const check = (t: string) => Date.now() < parseJwt(t).exp * 1000

// ✅ Correto — nome autoexplicativo, sem comentário
const isTokenExpired = (token: string) => Date.now() >= parseJwt(token).exp * 1000
```

### A única exceção

Licenças ou avisos legais no topo de arquivos gerados por ferramentas. Nunca por escolha do desenvolvedor.

---

## O que Evitar

| Prática | Alternativa |
|---|---|
| `try/catch` espalhados | Error boundaries, `onError` do TanStack Query, tipo `Result` |
| `useEffect` para fetching | Loaders do TanStack Router + TanStack Query |
| Props drilling > 2 níveis | Composição, context ou estado global |
| Lógica de negócio em componentes | Extrair para hooks ou services |
| `any` no TypeScript | `unknown` + type guards |
| Comentários de qualquer tipo | Nomes melhores, funções menores |
| Default exports em componentes | Named exports |
| Mutação direta de estado | Sempre retornar novo valor |
| Comentários que explicam o código | Código autoexplicativo com nomes claros |
