import { config } from "dotenv";
config({ path: ".env", override: true });

/** Entorno general */
export const ENVIRONMENT = process.env.ENVIRONMENT ?? "development";
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const TIMEZONE = process.env.TIMEZONE ?? "UTC";

/** Servidor */
export const PORT = Number(process.env.PORT);
export const APP_URL = process.env.APP_URL;
export const SOCKET_URL = process.env.SOCKET_URL;

/** Base de datos y Redis */
export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const REDIS_URL = process.env.REDIS_URL ?? "";

/** JWT */
export const JWT_SECRET = process.env.JWT_SECRET;

/** AWS  */
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME ?? "";
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION ?? "";
export const AWS_KEY_ACCESS = process.env.AWS_KEY_ACCESS ?? "";
export const AWS_KEY_ACCESS_SECRET = process.env.AWS_KEY_ACCESS_SECRET ?? "";

/** Email*/
export const EMAIL_ADMIN = process.env.EMAIL_ADMIN ?? "";
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD ?? "";
export const SMTP_HOST = process.env.SMTP_HOST ?? "";
export const SMTP_PORT = process.env.SMTP_PORT ?? "";

/** Google */
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL ?? "";

/**  Facebook */
export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID ?? "";
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET ?? "";
export const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL ?? "";
