import pino from "pino";
import { config } from "./env";

const isProduction = config.NODE_ENV === "production";
const isDevelopment = config.NODE_ENV === "development";

export const logger = pino({
  level: config.LOG_LEVEL || (isProduction ? "info" : "debug"),

  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
          singleLine: false,
          messageFormat: "{levelLabel} - {msg}",
        },
      }
    : undefined,

  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },

  base: isProduction
    ? {
        env: config.NODE_ENV,
      }
    : undefined,

  timestamp: pino.stdTimeFunctions.isoTime,
});

export type Logger = typeof logger;
