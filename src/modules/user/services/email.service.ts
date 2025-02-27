import { BulkEmailDTO } from '../domain/dtos/bulk_email.dto';
import { getAllUsersEmails } from '../data/repository/user.repository';
import { sendEmail } from '../../../shared/utils/emailSender';

export const sendBulkEmail = async (data: BulkEmailDTO): Promise<void> => {

  const emails = await getAllUsersEmails();


  for (const email of emails) {
    try {
      await sendEmail(
        email,
        data.subject,
        data.text,
        data.html
      );
      console.log(`Correo enviado a: ${email}`);
    } catch (error) {
      console.error(`Error enviando a ${email}:`, error);
    }
  }
};
