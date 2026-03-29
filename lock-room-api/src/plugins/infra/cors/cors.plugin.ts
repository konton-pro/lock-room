import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { corsConfig } from "@configs/cors.config";

export const corsPlugin = new Elysia({ name: "plugin:cors" }).use(
  cors({
    origin: corsConfig.allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
