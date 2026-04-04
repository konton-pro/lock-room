import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import { app } from "@/index";
import { dbTransaction } from "@tests/helpers/database/db-transaction";
import { UserFactory } from "@tests/factories/user/user.factory";
import { VaultFactory } from "@tests/factories/vault/vault.factory";
import { authHelper } from "@tests/helpers/modules/auth.helper";
import { VAULT_ERRORS } from "@modules/vault/vault.constants";

const vaultPayload = () => ({
  encryptedHeader: Buffer.from(faker.string.alphanumeric(32)).toString(
    "base64",
  ),
  encryptedBody: Buffer.from(faker.string.alphanumeric(64)).toString("base64"),
  clientIv: Buffer.alloc(12).toString("base64"),
});

const makeRequest = (
  method: string,
  path: string,
  opts: { token?: string; body?: unknown } = {},
) =>
  app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": faker.internet.ip(),
        ...(opts.token && { Authorization: `Bearer ${opts.token}` }),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    }),
  );

const get = (path: string, token?: string) =>
  makeRequest("GET", path, { token });

const post = (path: string, token?: string, body?: unknown) =>
  makeRequest("POST", path, { token, body });

const del = (path: string, token?: string) =>
  makeRequest("DELETE", path, { token });

describe("POST /vault", () => {
  dbTransaction();

  it("deve armazenar um item e retornar 201 com cuid", async () => {
    const [user] = await new UserFactory().create();
    const token = await authHelper.getToken(user!);

    const res = await post("/vault", token, vaultPayload());
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toHaveProperty("cuid");
    expect(typeof data.cuid).toBe("string");
  });

  it("deve retornar 401 sem token", async () => {
    const res = await post("/vault", undefined, vaultPayload());

    expect(res.status).toBe(401);
  });

  it("deve retornar 401 com token inválido", async () => {
    const res = await post("/vault", "invalid-token", vaultPayload());

    expect(res.status).toBe(401);
  });

  it("deve retornar 422 com body inválido", async () => {
    const [user] = await new UserFactory().create();
    const token = await authHelper.getToken(user!);

    const res = await post("/vault", token, {
      encryptedHeader: "only-one-field",
    });
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
  });
});

describe("GET /vault", () => {
  dbTransaction();

  it("deve retornar lista vazia quando não há itens", async () => {
    const [user] = await new UserFactory().create();
    const token = await authHelper.getToken(user!);

    const res = await get("/vault", token);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });

  it("deve retornar apenas os itens do usuário autenticado", async () => {
    const [user] = await new UserFactory().create();
    const token = await authHelper.getToken(user!);

    await new VaultFactory().setCount(2).create(user!.cuid);

    const [otherUser] = await new UserFactory().create();
    await new VaultFactory().create(otherUser!.cuid);

    const res = await get("/vault", token);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toHaveProperty("cuid");
    expect(data[0]).toHaveProperty("encryptedHeader");
    expect(data[0]).toHaveProperty("clientIv");
    expect(data[0]).toHaveProperty("createdAt");
  });

  it("deve retornar 401 sem token", async () => {
    const res = await get("/vault");

    expect(res.status).toBe(401);
  });
});

describe("GET /vault/:id", () => {
  dbTransaction();

  let token: string;
  let cuid: string;

  beforeEach(async () => {
    const [user] = await new UserFactory().create();
    token = await authHelper.getToken(user!);
    const [item] = await new VaultFactory().create(user!.cuid);
    cuid = item!.cuid;
  });

  it("deve retornar o item com dados descriptografados", async () => {
    const res = await get(`/vault/${cuid}`, token);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("cuid", cuid);
    expect(data).toHaveProperty("encryptedHeader");
    expect(data).toHaveProperty("encryptedBody");
    expect(data).toHaveProperty("clientIv");
    expect(data).toHaveProperty("createdAt");
  });

  it("deve retornar 401 sem token", async () => {
    const res = await get(`/vault/${cuid}`);

    expect(res.status).toBe(401);
  });

  it("deve retornar 403 ao acessar item de outro usuário", async () => {
    const [otherUser] = await new UserFactory().create();
    const otherToken = await authHelper.getToken(otherUser!);

    const res = await get(`/vault/${cuid}`, otherToken);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.message).toBe(VAULT_ERRORS.FORBIDDEN);
  });

  it("deve retornar 404 para item inexistente", async () => {
    const res = await get(`/vault/${createId()}`, token);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe(VAULT_ERRORS.NOT_FOUND);
  });

  it("deve retornar 422 para id com formato inválido", async () => {
    const res = await get("/vault/not-a-valid-id", token);

    expect(res.status).toBe(422);
  });
});

describe("DELETE /vault/:id", () => {
  dbTransaction();

  let token: string;
  let cuid: string;

  beforeEach(async () => {
    const [user] = await new UserFactory().create();
    token = await authHelper.getToken(user!);
    const [item] = await new VaultFactory().create(user!.cuid);
    cuid = item!.cuid;
  });

  it("deve deletar o item e retornar 204", async () => {
    const res = await del(`/vault/${cuid}`, token);

    expect(res.status).toBe(204);
  });

  it("deve retornar 401 sem token", async () => {
    const res = await del(`/vault/${cuid}`);

    expect(res.status).toBe(401);
  });

  it("deve retornar 404 ao deletar item de outro usuário", async () => {
    const [otherUser] = await new UserFactory().create();
    const otherToken = await authHelper.getToken(otherUser!);

    const res = await del(`/vault/${cuid}`, otherToken);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe(VAULT_ERRORS.NOT_FOUND);
  });

  it("deve retornar 404 para item inexistente", async () => {
    const res = await del(`/vault/${createId()}`, token);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe(VAULT_ERRORS.NOT_FOUND);
  });
});
