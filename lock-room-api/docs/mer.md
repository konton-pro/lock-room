# MER — Lock Room API

```mermaid
Diagram
    users {
        serial id PK
        varchar(36) cuid UK
        varchar(255) name
        varchar(255) email UK
        varchar(255) password
        text encrypted_master_key
        varchar(64) master_key_iv
        varchar(64) master_key_tag
        varchar(64) master_key_salt
        timestamp created_at
        timestamp updated_at
    }

    vault {
        serial id PK
        varchar(36) cuid UK
        integer user_id FK
        bytea encrypted_header
        bytea encrypted_body
        bytea client_iv
        bytea server_header_iv
        bytea server_header_tag
        bytea server_body_iv
        bytea server_body_tag
        timestamp created_at
        timestamp updated_at
    }

    recovery_keys {
        serial id PK
        varchar(36) cuid UK
        integer user_id FK "UK"
        bytea encrypted_payload
        bytea client_iv
        bytea client_tag
        bytea server_iv
        bytea server_tag
        varchar(64) recovery_key_hash
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ vault : "has many"
    users ||--o| recovery_keys : "has one"
```

## Relações

| De | Para | Tipo | Descrição |
|----|------|------|-----------|
| `users` | `vault` | 1:N | Um usuário pode ter múltiplas entradas no vault |
| `users` | `recovery_keys` | 1:0..1 | Um usuário tem no máximo uma recovery key |
