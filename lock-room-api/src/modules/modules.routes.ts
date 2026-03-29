import { Elysia } from "elysia";
import { authRoutes } from "./auth/auth.routes";
import { vaultRoutes } from "./vault/vault.routes";

export const modulesRoutes = new Elysia().use(authRoutes).use(vaultRoutes);
