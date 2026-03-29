import { t } from "elysia";

export const registerSchema = {
  body: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
  }),
};

export const loginSchema = {
  body: t.Object({
    email: t.String({ format: "email" }),
    password: t.String(),
  }),
};
