# Vault — Encryption & Decryption

O vault usa **dupla camada de criptografia (E2EE + server-side)**. O dado nunca chega ao banco em texto puro — nem o servidor consegue ler o conteúdo original sem a master key do usuário.

---

## Visão Geral das Camadas

```
[Dado original]
      │
      ▼  (Camada 1 — cliente)
[AES-256-GCM com master key do usuário]
      │  → encryptedHeader  (base64)
      │  → encryptedBody    (base64)
      │  → clientIv         (base64)  ← IV gerado pelo cliente
      │
      ▼  (Camada 2 — servidor)
[AES-256-GCM com server master key]
      │  → encryptedHeader  (bytea no banco)  ← agora duplamente criptografado
      │  → encryptedBody    (bytea no banco)
      │  → serverHeaderIv   (bytea)
      │  → serverHeaderTag  (bytea)
      │  → serverBodyIv     (bytea)
      │  → serverBodyTag    (bytea)
      │  → clientIv         (bytea)  ← preservado para o cliente descriptografar depois
```

---

## Algoritmo do Servidor

- **Algoritmo**: `AES-256-GCM`
- **IV length**: 12 bytes (gerado via `randomBytes(12)` a cada operação)
- **Chave**: `cryptoConfig.masterKey` (variável de ambiente `CRYPTO_MASTER_KEY`)
- **Implementação**: `src/plugins/crypto/server-crypto/server-crypto.helpers.ts`

O GCM é um modo autenticado — além de criptografar, ele gera uma **auth tag** que garante integridade. Por isso cada campo tem seu próprio `iv` + `tag`.

---

## Por que header e body são criptografados separadamente?

O endpoint `GET /vault` (listagem) precisa retornar os **headers** de todos os itens do usuário, mas **não os bodies** (que podem ser grandes e não são necessários na listagem).

Isso permite que o servidor descriptografe (camada 2) apenas o header durante o `list`, sem tocar no body — economizando processamento e não expondo dados desnecessários.

| Endpoint | Server descriptografa | Retorna ao cliente |
|---|---|---|
| `GET /vault` | `encryptedHeader` only | header (L1 ainda criptografado) + `clientIv` |
| `GET /vault/:id` | `encryptedHeader` + `encryptedBody` | header + body (L1 ainda criptografados) + `clientIv` |

---

## Campos e seus papéis

| Campo | Tipo no banco | Quem gera | Para quê |
|---|---|---|---|
| `encrypted_header` | `bytea` | servidor (L2) | header duplamente criptografado |
| `encrypted_body` | `bytea` | servidor (L2) | body duplamente criptografado |
| `client_iv` | `bytea` | cliente | IV usado pelo cliente na L1 — necessário para descriptografar no cliente |
| `server_header_iv` | `bytea` | servidor | IV da L2 para o header — necessário para o servidor descriptografar |
| `server_header_tag` | `bytea` | servidor | auth tag da L2 para o header — garante integridade (GCM) |
| `server_body_iv` | `bytea` | servidor | IV da L2 para o body |
| `server_body_tag` | `bytea` | servidor | auth tag da L2 para o body |

---

## Fluxo: Store (`POST /vault`)

```
Cliente                                    Servidor
   │                                          │
   │  encryptedHeader (base64, L1)            │
   │  encryptedBody   (base64, L1)   ──────►  │
   │  clientIv        (base64)                │
   │                                          │
   │                              L2 encrypt(encryptedHeader)
   │                                → serverHeaderIv + serverHeaderTag
   │                              L2 encrypt(encryptedBody)
   │                                → serverBodyIv + serverBodyTag
   │                                          │
   │                              INSERT no banco (bytea)
   │                                          │
   │  ◄──────────────────────────  { cuid }   │
```

**Código** (`vault.service.ts:14-28`):
```ts
const headerL2 = crypto.encrypt(Buffer.from(input.encryptedHeader, "base64"));
const bodyL2   = crypto.encrypt(Buffer.from(input.encryptedBody, "base64"));

vaultRepository.create({
  encryptedHeader: headerL2.encrypted,
  encryptedBody:   bodyL2.encrypted,
  clientIv:        Buffer.from(input.clientIv, "base64"),
  serverHeaderIv:  headerL2.iv,
  serverHeaderTag: headerL2.tag,
  serverBodyIv:    bodyL2.iv,
  serverBodyTag:   bodyL2.tag,
});
```

---

## Fluxo: Retrieve (`GET /vault/:id`)

```
Cliente                                    Servidor
   │                                          │
   │  GET /vault/:id        ──────────────►   │
   │                                          │
   │                              SELECT do banco
   │                              L2 decrypt(encryptedHeader, serverHeaderIv, serverHeaderTag)
   │                                → volta para encryptedHeader (L1)
   │                              L2 decrypt(encryptedBody, serverBodyIv, serverBodyTag)
   │                                → volta para encryptedBody (L1)
   │                                          │
   │  ◄──────  encryptedHeader (base64, L1)   │
   │           encryptedBody   (base64, L1)   │
   │           clientIv        (base64)       │
   │                                          │
   │  L1 decrypt(encryptedHeader, clientIv, userMasterKey)
   │  L1 decrypt(encryptedBody,   clientIv, userMasterKey)
   │    → dado original
```

---

## Fluxo: List (`GET /vault`)

Igual ao retrieve, mas **somente o header** é descriptografado (L2). O body permanece intocado — não é nem lido do banco para esse endpoint.

```
Retorno por item:
{
  cuid,
  encryptedHeader,  ← L2 removida, L1 ainda presente
  clientIv,         ← para o cliente descriptografar no momento que precisar
  createdAt
}
```

---

## Resumo de responsabilidades

| Responsável | Ação |
|---|---|
| **Cliente** | Criptografa com a master key do usuário (L1), gera `clientIv` |
| **Servidor** | Re-criptografa com sua própria key (L2), armazena tudo como `bytea` |
| **Servidor (retrieve)** | Remove a L2, devolve dados ainda em L1 para o cliente |
| **Cliente** | Remove a L1 usando `clientIv` + master key do usuário |
