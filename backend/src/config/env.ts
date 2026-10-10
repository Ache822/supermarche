import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/supermarche"),
  JWT_SECRET: z.string().min(32).default("supermarche_super_secret_jwt_key_32chars_min_length"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  SMTP_HOST: z.string().default("sandbox.smtp.mailtrap.io"),
  SMTP_PORT: z.string().default("2525"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  EMAIL_FROM: z.string().default("Supermarche Marketing <no-reply@supermarche.cm>")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.format());
  throw new Error("Environment validation failed");
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: Number(parsed.data.PORT),
  mongodbUri: parsed.data.MONGODB_URI,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  corsOrigin: parsed.data.CORS_ORIGIN,
  smtpHost: parsed.data.SMTP_HOST,
  smtpPort: Number(parsed.data.SMTP_PORT),
  smtpUser: parsed.data.SMTP_USER,
  smtpPass: parsed.data.SMTP_PASS,
  emailFrom: parsed.data.EMAIL_FROM
};
