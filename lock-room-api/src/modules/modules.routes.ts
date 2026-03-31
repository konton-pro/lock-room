import { Elysia } from "elysia";
import { authRoutes } from "@/modules/auth/auth.routes";
import { vaultRoutes } from "@/modules/vault/vault.routes";

export const modulesRoutes = new Elysia().use(authRoutes).use(vaultRoutes);
