import { defineConfig } from "drizzle-kit";
import { databaseConfig } from "./src/configs/database.config";

export default defineConfig({
  schema: "./src/database/schema",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseConfig.connectionString,
  },
});
