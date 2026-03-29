import { z } from "zod";

export const registerSchema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
};
