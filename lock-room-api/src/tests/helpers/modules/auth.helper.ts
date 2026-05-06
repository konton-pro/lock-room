import { app } from "@/index";
import type { UserFactoryResult } from "@tests/factories/user/user-factory.types";

export const authHelper = {
  async getSessionCookie(
    user: UserFactoryResult,
    options: { ip?: string; userAgent?: string } = {},
  ): Promise<string> {
    const res = await app.handle(
      new Request("http://localhost/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": options.ip ?? "203.0.113.10",
          "user-agent": options.userAgent ?? "lock-room-tests/1.0",
        },
        body: JSON.stringify({ email: user.email, password: user.password }),
      }),
    );

    return res.headers.get("set-cookie") ?? "";
  },
};
