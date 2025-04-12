// src/modules/email/presentation/services/email.service.ts
import { EmailRepository } from "../../data/repository/email.repository";
import { BulkEmailDTO } from "../../domain/dtos/bulk_email.dto";
import { sendEmail } from "../../../../utils/email_sender";
import { generateCodeToken, verifyCodeToken } from "../../../../config/jwt";

export class EmailService {
  private emailRepository: EmailRepository;

  constructor() {
    this.emailRepository = new EmailRepository();
  }

  async sendVerificationCode(email: string) {
    const token = generateCodeToken(email, "verification");
    await sendEmail(email, "Your Verification Code", `Your code is: ${token}`);
    return token; // Se devuelve en caso de depuración o pruebas
  }

  async verifyCode(token: string) {
    const decoded = verifyCodeToken(token);
    if (!decoded) throw new Error("Invalid or expired verification code");
    
    const user = await this.emailRepository.getEmail(decoded.email);
    if (!user) throw new Error("User not found");
    
    await this.emailRepository.updateUserStatus(decoded.email, "active");
    return { message: "User verified successfully" };
  }
  async sendBulkEmail(data: BulkEmailDTO) {
    const emails = await this.emailRepository.getUsersEmails(data.user_type);

    for (const email of emails) {
      try {
        await sendEmail(email, data.subject, data.text, data.html);
        console.log(`Email sent to: ${email}`);
      } catch (error) {
        console.error(`Error sending to ${email}:`, error);
      }
    }

    return { message: `Bulk email sent to ${emails.length} users.` };
  }
}