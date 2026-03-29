import { faker } from "@faker-js/faker";
import { app } from "@/index";
import type { UserFactoryResult } from "@tests/factories/user/user-factory.types";

export const authHelper = {
  async getToken(user: UserFactoryResult): Promise<string> {
    const res = await app.handle(
      new Request("http://localhost/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": faker.internet.ip(),
        },
        body: JSON.stringify({ email: user.email, password: user.password }),
      }),
    );

    const data = (await res.json()) as { token: string };
    return data.token;
  },
};
