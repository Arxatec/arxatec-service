import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_ADMIN, SMTP_HOST, SMTP_PORT } from "../env";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: EMAIL_ADMIN,
    pass: EMAIL_PASSWORD,
  },
  tls: {
    ciphers: "TLSv1.2",
    rejectUnauthorized: false,
  },
});

export default transporter;
