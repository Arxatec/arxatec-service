// src/utils/email_sender/index.ts
import { Attachment } from "nodemailer/lib/mailer";
import transporter from "../../config/email";
import { EMAIL_ADMIN } from "../../config";
import fs from "fs";
import path from "path";

function tryResolveAsset(file: string): string | null {
  const p = path.join(process.cwd(), "public", "assets", file);
  return fs.existsSync(p) ? p : null;
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: Attachment[]
): Promise<void> {
  const baseAttachments: Attachment[] = [];
  const logoPath = tryResolveAsset("logo.png");

  if (logoPath) {
    baseAttachments.push({
      filename: "logo.png",
      path: logoPath,
      cid: "logo",
    });
  }

  try {
    await transporter.sendMail({
      from: EMAIL_ADMIN,
      to,
      subject,
      text,
      html,
      attachments: [...baseAttachments, ...(attachments || [])],
    });
  } catch (err: any) {
    const reason = err?.response || err?.message || String(err);
    throw new Error(`Error al enviar el correo electrónico: ${reason}`);
  }
}
