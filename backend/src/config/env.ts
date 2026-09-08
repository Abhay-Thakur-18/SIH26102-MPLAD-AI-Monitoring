import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default("/api/v1"),
  APP_NAME: z.string().default("AEGIS-MPLADS-AI"),
  APP_URL: z.string().default("http://localhost:8080"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  OTP_TTL_SECONDS: z.coerce.number().default(300),
  OTP_LENGTH: z.coerce.number().default(6),
  SMTP_HOST: z.string().default("smtp.example.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().default("noreply@aegis-mplads.gov.in"),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),
  AI_SERVICE_URL: z.string().default("http://localhost:8000"),
  AI_SERVICE_TIMEOUT_MS: z.coerce.number().default(30000),
  INTERNAL_API_KEY: z.string().min(16),
  COOKIE_SECURE: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  COOKIE_DOMAIN: z.string().optional().default(""),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(200)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${issues}`);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
