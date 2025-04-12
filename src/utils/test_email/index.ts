//npx tsx src/utils/test_email/index.ts

import { sendEmail } from "../email_sender";

const testEmail = async () => {
  try {
    await sendEmail(
      "jhonny-529@outlook.com",
      "Test de Correo",
      "Prueba desde Nodemailer con GoDaddy.",
      "<h1>Correo de Prueba</h1><p>El envio está bien configurado</p>"
    );

    console.log("El correo se ha enviado, revisa tu bandeja de entrada.");
  } catch (error) {
    console.error("No se envió el correo, error:", error);
  }
};

testEmail();
