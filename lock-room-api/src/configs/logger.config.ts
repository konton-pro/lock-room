export const loggerConfig = {
  dir: process.env.LOG_DIR ?? "logs",
  level: process.env.LOG_LEVEL ?? "info",
  pretty: process.env.NODE_ENV !== "production",
};
