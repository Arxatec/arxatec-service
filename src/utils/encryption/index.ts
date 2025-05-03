import crypto from "crypto";
import { JWT_SECRET } from "../../config/env";

const ENCRYPTION_KEY = JWT_SECRET ?? "";
if (ENCRYPTION_KEY.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long for AES-256 encryption.");
}
const AES_KEY = ENCRYPTION_KEY.slice(0, 32);
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(AES_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(AES_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
