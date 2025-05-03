import transporter from "../../config/email";
import { EMAIL_USER } from "../../config/env";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
}
