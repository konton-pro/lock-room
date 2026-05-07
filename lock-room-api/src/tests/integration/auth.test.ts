import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { app } from "@/index";
import { dbTransaction } from "@tests/helpers/database/db-transaction";
import { UserFactory } from "@tests/factories/user/user.factory";
import { AUTH_ERRORS } from "@modules/auth/auth.constants";

const registerPayload = (overrides: Record<string, unknown> = {}) => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: "password123",
  encryptedMasterKey: Buffer.from(faker.string.alphanumeric(48)).toString(
    "base64",
  ),
  masterKeyIv: Buffer.from(faker.string.alphanumeric(12)).toString("base64"),
  masterKeyTag: Buffer.from(faker.string.alphanumeric(16)).toString("base64"),
  masterKeySalt: Buffer.from(faker.string.alphanumeric(16)).toString("base64"),
  recoveryEncryptedPayload: Buffer.from(
    faker.string.alphanumeric(64),
  ).toString("base64"),
  recoveryIv: Buffer.from(faker.string.alphanumeric(12)).toString("base64"),
  recoveryTag: Buffer.from(faker.string.alphanumeric(16)).toString("base64"),
  recoveryKeyHash: faker.string.hexadecimal({ length: 64, prefix: "" }),
  ...overrides,
});

const post = (
  path: string,
  body: unknown,
  options: { cookie?: string; ip?: string; userAgent?: string } = {},
) =>
  app.handle(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": options.ip ?? faker.internet.ip(),
        "user-agent": options.userAgent ?? "lock-room-tests/1.0",
        ...(options.cookie ? { Cookie: options.cookie } : {}),
      },
      body: JSON.stringify(body),
    }),
  );

describe("POST /auth/register", () => {
  dbTransaction();

  it("deve registrar um usuário e retornar 201", async () => {
    const payload = registerPayload();
    const res = await post("/auth/register", payload);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.email).toBe(payload.email);
    expect(data).toHaveProperty("id");
  });

  it("deve retornar 409 quando o email já está em uso", async () => {
    const [user] = await new UserFactory().create();
    const res = await post(
      "/auth/register",
      registerPayload({ email: user!.email }),
    );
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.message).toBe(AUTH_ERRORS.EMAIL_ALREADY_IN_USE);
  });

  it("deve retornar 422 para email inválido", async () => {
    const res = await post(
      "/auth/register",
      registerPayload({ email: "not-an-email" }),
    );
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
    expect(data.errors[0].campo).toBe("email");
  });

  it("deve retornar 422 para nome vazio", async () => {
    const res = await post("/auth/register", registerPayload({ name: "" }));
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
    expect(data.errors[0].campo).toBe("name");
  });

  it("deve retornar 422 para senha com menos de 8 caracteres", async () => {
    const res = await post(
      "/auth/register",
      registerPayload({ password: "short" }),
    );
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
    expect(data.errors[0].campo).toBe("password");
  });
});

describe("POST /auth/login", () => {
  dbTransaction();

  it("deve autenticar e definir cookie de sessão", async () => {
    const [user] = await new UserFactory().create();
    const res = await post("/auth/login", {
      email: user!.email,
      password: user!.password,
    });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).not.toHaveProperty("token");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("encryptedMasterKey");
    expect(data).toHaveProperty("masterKeyIv");
    expect(data).toHaveProperty("masterKeyTag");
    expect(data).toHaveProperty("masterKeySalt");
    expect(res.headers.get("set-cookie")).toContain("lock_room_session=");
  });

  it("deve retornar 401 para senha incorreta", async () => {
    const [user] = await new UserFactory().create();
    const res = await post("/auth/login", {
      email: user!.email,
      password: "wrong-password",
    });
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toBe(AUTH_ERRORS.INVALID_CREDENTIALS);
  });

  it("deve retornar 401 para email não cadastrado", async () => {
    const res = await post("/auth/login", {
      email: faker.internet.email(),
      password: "password123",
    });
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toBe(AUTH_ERRORS.INVALID_CREDENTIALS);
  });

  it("deve retornar 422 para email inválido", async () => {
    const res = await post("/auth/login", {
      email: "not-an-email",
      password: "password123",
    });
    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
    expect(data.errors[0].campo).toBe("email");
  });
});

describe("POST /auth/logout", () => {
  dbTransaction();

  it("deve encerrar sessão e limpar cookie", async () => {
    const [user] = await new UserFactory().create();
    const ip = "203.0.113.42";
    const userAgent = "lock-room-tests/1.0";
    const loginRes = await post("/auth/login", {
      email: user!.email,
      password: user!.password,
    }, { ip, userAgent });
    const cookie = loginRes.headers.get("set-cookie") ?? "";

    const res = await post(
      "/auth/logout",
      {},
      { cookie, ip, userAgent },
    );

    expect(res.status).toBe(204);
    expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("deve retornar 401 sem sessão", async () => {
    const res = await post("/auth/logout", {});

    expect(res.status).toBe(401);
  });
});
