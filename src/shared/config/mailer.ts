// src/shared/config/mailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verificación de correo electrónico',
    html: `<p>Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
           <a href="http://tudominio.com/verify-email?token=${token}">Verificar correo electrónico</a>`,
  };

  await transporter.sendMail(mailOptions);
};