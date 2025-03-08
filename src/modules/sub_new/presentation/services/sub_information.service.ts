import { SubscribeDTO } from "../../domain/dtos/sub_information.dto";
import { subscribeUser, findSubscriberByEmail } from "../../data/repository/sub_information.repository";
import { sendEmail } from "../../../../shared/utils/emailSender";

export const subscribeToUpdates = async (data: SubscribeDTO): Promise<string> => {
  const existingSubscriber = await findSubscriberByEmail(data.email);
  if (existingSubscriber) {
    throw new Error("Ya está suscrito a las actualizaciones.");
  }

  await subscribeUser(data.name, data.email);

  const subject = "¡Gracias por suscribirte a Arxatec!";
  const text = `Hola ${data.name}, gracias por suscribirte a nuestras actualizaciones. Pronto recibirás noticias exclusivas.`;
  const html = `
    <h1>¡Bienvenido a Arxatec!</h1>
    <p>Hola <strong>${data.name}</strong>, gracias por suscribirte a nuestras actualizaciones.</p>
    <p>Pronto recibirás noticias exclusivas sobre nuestras nuevas funcionalidades.</p>
  `;

  await sendEmail(data.email, subject, text, html);

  return "Suscripción exitosa. Revisa tu correo para más detalles.";
};
