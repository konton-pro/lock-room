import { Elysia } from "elysia";
import { authRoutes } from "./auth/auth.routes";

export const modulesRoutes = new Elysia().use(authRoutes);
