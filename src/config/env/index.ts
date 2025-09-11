import { config } from "dotenv";

config();

// ENVIRONMENT
export const ENVIRONMENT = process.env.ENVIRONMENT;

// TIMEZONE
export const TIMEZONE = process.env.TIMEZONE ?? "UTC";

// PROJECT ROOT
export const PROJECT_ROOT = process.env.PROJECT_ROOT;

// REDIS
export const REDIS_URL = process.env.REDIS_URL;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;

// SERVER
export const PORT = process.env.PORT;
export const APP_URL = process.env.APP_URL;
export const SOCKET_URL = process.env.SOCKET_URL;
export const NODE_ENV = process.env.NODE_ENV;

// DATABASE
export const DATABASE_URL = process.env.DATABASE_URL;

// AWS
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const AWS_KEY_ACCESS = process.env.AWS_KEY_ACCESS;
export const AWS_KEY_ACCESS_SECRET = process.env.AWS_KEY_ACCESS_SECRET;

// EMAIL (SMTP)
export const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
