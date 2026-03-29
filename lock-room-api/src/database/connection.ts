import { Pool } from "pg";
import { databaseConfig } from "@configs/database.config";

export const pool = new Pool(databaseConfig);
