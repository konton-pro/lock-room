import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { sessionConfig } from "@configs/session.config";

export const swaggerPlugin = new Elysia({ name: "plugin:swagger" }).use(
  swagger({
    provider: "scalar",
    documentation: {
      info: {
        title: "Lock Room API",
        version: "1.0.0",
        description: "End-to-end encrypted vault API",
      },
      tags: [
        { name: "Auth", description: "Authentication endpoints" },
        { name: "Vault", description: "Vault management endpoints" },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: sessionConfig.cookieName,
          },
        },
      },
    },
    path: "/docs",
  }),
);
