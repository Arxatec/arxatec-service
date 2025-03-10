import { HttpStatusCodes, MESSAGES } from "../../../../constants";
import { AppError, sendEmail } from "../../../../utils";
import { SupportFormDTO } from "../../domain/dtos/form.dtos";

export class FormService {
  constructor() {}
  async submitSupportForm(formData: SupportFormDTO) {
    try {
      const emailAdmin = process.env.EMAIL_ADMIN;
      const subject = "Nueva solicitud de contacto";
      const text =
        "Se ha recibido una nueva solicitud de contacto a través del formulario de 'Contáctanos y Soporte' de Arxatec.";
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
  <title>Nueva solicitud de contacto</title>
</head>
<body style="font-family: 'DM Sans', Arial, sans-serif; ">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

    @font-face {
      font-family: 'DM Sans';
      src: url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
    }
  </style>

  <div style="width: 100%; max-width: 600px; margin: 1rem auto; background-color: #fff; padding: 1rem; border-radius: 0.5rem">
    <img src="https://www.arxatec.net/assets/logo.png" alt="logo" width="150" style="margin: 0 auto; display: block; ">
    <h1 style="font-size: 1.2rem; color: #111827; font-weight: 900; font-family: 'DM Sans', Arial, sans-serif; text-align: center; margin-top: 2rem; ">
      Nueva solicitud de contacto
    </h1>
    <br/>

    <p style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
      <b>¡Atención administrador!</b>
      <br/>
      <br/>
      Se ha recibido una nueva solicitud de contacto a través del formulario de "Contáctanos y Soporte" de Arxatec. A continuación, los detalles del remitente:
    </p>
    <ul style="font-size: 0.8rem; margin: 1rem 0; color: #4b5563; padding: 0.8rem 2rem; border-radius: 0.5rem; background-color: #f1f5f9;">
      <li>
        <b>Nombre:</b>
        ${formData.first_name} ${formData.last_name}
      </li>
      <li>
        <b>Correo electrónico:</b>
        ${formData.email}
      </li>
      <li>
        <b>Telefóno:</b>
        ${formData.phone}
      </li>
      <li>
        <b>País:</b>
        ${formData.country}
      </li>
      <li>
        <b>Asunto:</b>
        ${formData.subject}
      </li>
      <li>
        <b>Mensaje:</b>
        ${formData.message}
      </li>
    </ul>
    <p style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
      Recuerda que según nuestras políticas, debemos responder a todas las solicitudes en un plazo máximo de 24 horas.
    </p>
    <a href="https://arxatec-platform.vercel.app/login" style="text-decoration: none; margin: 1.5rem 0rem; background-color: #2563eb;  padding: 0.8rem 1rem; color: #fff; font-family: 'DM Sans', Arial, sans-serif; font-weight: 600; border-radius: 0.3rem; display: block; font-size: 0.8rem; text-align: center; ">
      Ingresar al panel de administrador
    </a>
    <p style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
      Este es un mensaje automático del sistema de Arxatec.
    </p>

    <div style="border-top: 1px solid #d1d5db; margin-top: 32px; padding-top: 10px; font-size: 12px; color: #9ca3af;">
      <p style="font-family: 'DM Sans', Arial, sans-serif;">
      Este correo es confidencial y está destinado únicamente para administradores de Arxatec.
      </p> 
    </div>
  </div>
  </div>
</body>
</html>
      `;

      if (!emailAdmin) {
        throw new AppError(
          MESSAGES.FORM.SUPPORT_ERROR_INTERNAL_SERVER_ERROR,
          HttpStatusCodes.INTERNAL_SERVER_ERROR.code
        );
      }
      await sendEmail(emailAdmin, subject, text, html);

      return MESSAGES.FORM.SUPPORT_SUCCESS;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        MESSAGES.FORM.SUPPORT_ERROR_INTERNAL_SERVER_ERROR,
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }
}
