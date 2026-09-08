import winston from "winston";
import { env, isProduction } from "./env";

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, requestId, stack, ...meta }) => {
    const rid = requestId ? ` [${requestId}]` : "";
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} ${level}${rid}: ${message}${stack ? `\n${stack}` : ""}${extra}`;
  })
);

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  defaultMeta: { service: env.APP_NAME },
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.Console({
      format: isProduction ? combine(timestamp(), json()) : consoleFormat
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.File({ filename: "logs/security.log", level: "warn" }),
    new winston.transports.File({ filename: "logs/ai.log" })
  ]
});

export const securityLogger = logger.child({ channel: "security" });
export const aiLogger = logger.child({ channel: "ai" });
export const dbLogger = logger.child({ channel: "database" });
