//npx tsx src/shared/utils/testEmail.ts

import { sendEmail } from "./emailSender";

const testEmail = async () => {
  try {
    await sendEmail(
      "process.env.EMAIL_USER",
      "Test de Correo",
      "Prueba desde Nodemailer con GoDaddy.",
      "<h1>Correo de Prueba</h1><p>El envio esta bien configurado</p>"
    );

    console.log("El correo se ha enviado, en unos minutos aparecera");
  } catch (error) {
    console.error("No se envio el correo, alguna falla:", error);
  }
};

testEmail();

