import { config } from "dotenv";

config();

// API KEYS GEMINI
export const API_KEY_GEMINI = process.env.API_KEY_GEMINI;

// EMAIL ADMIN
export const EMAIL_ADMIN = process.env.EMAIL_ADMIN;

// DATABASE URL LOCAL
export const DATABASE_URL = process.env.DATABASE_URL;

// DATABASE URL PROD
export const DATABASE_URL_PROD = process.env.DATABASE_URL_PROD;
export const DIRECT_URL_PROD = process.env.DIRECT_URL_PROD;

// REDIS
export const REDIS_URL = process.env.REDIS_URL;

// PORT
export const PORT = process.env.PORT;

// ENVIROMENT
export const NODE_ENV = process.env.NODE_ENV;

// APP URL
export const APP_URL = process.env.APP_URL;

// SOCKET URL
export const SOCKET_URL = process.env.SOCKET_URL;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;

// EMAIL
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;

// AWS
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const AWS_KEY_ACCESS = process.env.AWS_KEY_ACCESS;
export const AWS_KEY_ACCESS_SECRET = process.env.AWS_KEY_ACCESS_SECRET;

// AROUND
export const MAX_LAWYER_CASES = process.env.MAX_LAWYER_CASES;
