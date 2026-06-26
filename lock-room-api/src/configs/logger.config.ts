const parseBoolean = (value: string | undefined): boolean | null => {
  if (value === undefined) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
};

const prettyFromEnv = parseBoolean(process.env.LOG_PRETTY);

export const loggerConfig = {
  dir: process.env.LOG_DIR ?? "logs",
  level: process.env.LOG_LEVEL ?? "info",
  pretty: prettyFromEnv ?? process.env.NODE_ENV !== "production",
};
