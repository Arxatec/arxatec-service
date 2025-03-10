import { SubscribeDTO } from "../../domain/dtos/waitlist.dto";
import { sendEmail } from "../../../../utils/email_sender";
import { WaitlistRepository } from "../../data/repository/waitlist.repository";
import { AppError } from "../../../../utils";
import { MESSAGES } from "../../../../constants";
import { HttpStatusCodes } from "../../../../constants";
export class WaitlistService {
  constructor(private readonly waitlistRepository: WaitlistRepository) {}

  async subscribeToUpdates(data: SubscribeDTO): Promise<string> {
    try {
      const existingSubscriber =
        await this.waitlistRepository.findSubscriberByEmail(data.email);

      if (existingSubscriber) {
        throw new AppError(
          MESSAGES.WAITLIST.SUBSCRIBE_ERROR_ALREADY_SUBSCRIBED,
          HttpStatusCodes.BAD_REQUEST.code
        );  
      }

      await this.waitlistRepository.subscribeUser(data.name, data.email);

      const subject = "¡Gracias por suscribirte a Arxatec!";
      const text = `Hola ${data.name}, gracias por suscribirte a nuestras actualizaciones. Pronto recibirás noticias exclusivas.`;
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
  <title>¡Gracias por suscribirte a la lista de espera de Arxatec!</title>
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
    <h1 style="font-size: 1.2rem; color: #111827; font-weight: 900; font-family: 'DM Sans', Arial, sans-serif; text-align: center; margin-top: 2rem; ">¡Gracias por suscribirte a la lista de espera de Arxatec!</h1>
    <p style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
      ¡Queremos agradecerte por suscribirte a nuestro newsletter!  Estamos emocionados de que te hayas unido a nuestra comunidad de personas interesadas en la innovación de servicios legales laborales.
      <br/><br/>
      Nos complace informarte que Arxatec aún no ha salido oficialmente al mercado, y tú serás uno de los primeros en enterarte cuando esto suceda. Tu interés temprano nos motiva a seguir trabajando en crear la mejor plataforma posible.
      <br/><br/>
      Como suscriptor de nuestro newsletter, recibirás:
    </p>
    <ul style="font-size: 0.8rem; margin: 1rem 0; color: #4b5563; padding: 0.8rem 2rem; border-radius: 0.5rem; background-color: #f1f5f9;">
      <li>Notificación exclusiva del lanzamiento oficial de Arxatec </li>
      <li>Información anticipada sobre nuestros servicios y planes </li>
      <li>Contenido educativo sobre derechos laborales y su protección </li>
      <li>Posibles ofertas especiales para usuarios que se registraron antes del lanzamiento </li>
    </ul>
    <p style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
      Arxatec está siendo desarrollada como una plataforma innovadora que busca democratizar el acceso a servicios legales laborales, empoderando a los trabajadores con herramientas tecnológicas y asesoría especializada.
      <br/><br/>
      Si tienes alguna pregunta o sugerencia mientras esperamos el lanzamiento, no dudes en contactarnos. ¡Tu opinión es muy valiosa para nosotros!
    </p>
    <a href="https://arxatec.vercel.app/es" style="text-decoration: none; margin: 1.5rem 0rem; background-color: #2563eb;  padding: 0.8rem 1rem; color: #fff; font-family: 'DM Sans', Arial, sans-serif; font-weight: 600; border-radius: 0.3rem; display: block; font-size: 0.8rem; text-align: center; ">
      Ingresar a Arxatec
    </a>
    <p style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
      Gracias por confiar en Arxatec desde el principio. Estamos trabajando para revolucionar la forma en que accedes a servicios legales laborales.
      <br/><br/>
      ¡Nos vemos pronto en el lanzamiento! 🚀
      <br/><br/>
      Atentamente, 
    </p>
    <b style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-weight: 900; font-family: 'DM Sans', Arial, sans-serif; ">El equipo de Arxatec</b>
    <div style="border-top: 1px solid #d1d5db; margin-top: 32px; padding-top: 10px; font-size: 12px; color: #9ca3af;">
      <p style="font-family: 'DM Sans', Arial, sans-serif;">Si no has enviado tus datos a Arxatec, por favor ignora este mensaje o contáctanos para aclarar la situación.</p> 
    </div>
  </div>
  </div>
</body>
</html>
      `;

      await sendEmail(data.email, subject, text, html);

      return MESSAGES.WAITLIST.SUBSCRIBE_SUCCESS;
    } catch (error) {
      throw new AppError(
        MESSAGES.WAITLIST.SUBSCRIBE_ERROR_INTERNAL_SERVER_ERROR,
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }
}
