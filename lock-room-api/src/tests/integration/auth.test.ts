import { describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { app } from "@/index";
import { dbTransaction } from "@tests/helpers/database/db-transaction";
import { UserFactory } from "@tests/factories/user/user.factory";
import { AUTH_ERRORS } from "@modules/auth/auth.constants";

const post = (path: string, body: unknown) =>
  app.handle(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": faker.internet.ip(),
      },
      body: JSON.stringify(body),
    }),
  );

describe("POST /auth/register", () => {
  dbTransaction();

  it("deve registrar um usuário e retornar 201", async () => {
    const name = faker.person.fullName();
    const email = faker.internet.email();

    const res = await post("/auth/register", {
      name,
      email,
      password: "password123",
    });

    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.email).toBe(email);
    expect(data).toHaveProperty("id");
  });

  it("deve retornar 409 quando o email já está em uso", async () => {
    const [user] = await new UserFactory().create();

    const res = await post("/auth/register", {
      name: faker.person.fullName(),
      email: user!.email,
      password: "password123",
    });

    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.message).toBe(AUTH_ERRORS.EMAIL_ALREADY_IN_USE);
  });

  it("deve retornar 422 para email inválido", async () => {
    const res = await post("/auth/register", {
      name: faker.person.fullName(),
      email: "not-an-email",
      password: "password123",
    });

    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
    expect(data.errors[0].campo).toBe("email");
  });

  it("deve retornar 422 para nome vazio", async () => {
    const res = await post("/auth/register", {
      name: "",
      email: faker.internet.email(),
      password: "password123",
    });

    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
    expect(data.errors[0].campo).toBe("name");
  });

  it("deve retornar 422 para senha com menos de 8 caracteres", async () => {
    const res = await post("/auth/register", {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "short",
    });

    const data = await res.json();

    expect(res.status).toBe(422);
    expect(data).toHaveProperty("errors");
    expect(data.errors[0].campo).toBe("password");
  });
});

describe("POST /auth/login", () => {
  dbTransaction();

  it("deve autenticar e retornar um token JWT", async () => {
    const [user] = await new UserFactory().create();

    const res = await post("/auth/login", {
      email: user!.email,
      password: user!.password,
    });

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("token");
    expect(typeof data.token).toBe("string");
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
