import pino from "pino";
import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { loggerConfig } from "@configs/logger.config";

function getLogPath(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const dir = join(loggerConfig.dir, year, month, day);
  mkdirSync(dir, { recursive: true });

  return join(dir, "logs.json");
}

const targets: pino.TransportTargetOptions[] = [
  {
    target: "pino/file",
    level: loggerConfig.level,
    options: { destination: getLogPath(), append: true },
  },
];

if (loggerConfig.pretty) {
  targets.push({
    target: "pino-pretty",
    level: loggerConfig.level,
    options: { colorize: true, translateTime: "SYS:standard", ignore: "pid" },
  });
}

export const logger = pino(
  { level: loggerConfig.level },
  pino.transport({ targets }),
);
