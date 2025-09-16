// src/modules/waitlist/presentation/waitlist.service.ts
import { SubscribeDTO } from "../domain/waitlist.schema";
import { WaitlistRepository } from "../data/waitlist.repository";
import { sendEmail } from "../../../utils/email_sender";
import { AppError } from "../../../utils/errors";
import { MESSAGES } from "../../../constants";
import { HttpStatusCodes } from "../../../constants/http_status_codes";

export class WaitlistService {
  constructor(private readonly repo = new WaitlistRepository()) {}

  async subscribeToUpdates(data: SubscribeDTO): Promise<string> {
    const exists = await this.repo.findSubscriberByEmail(data.email);
    if (exists) {
      throw new AppError(
        MESSAGES.WAITLIST.SUBSCRIBE_ERROR_ALREADY_SUBSCRIBED,
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    await this.repo.subscribeUser(data.name, data.email);

    const subject = "¡Gracias por suscribirte a Arxatec!";
    const text = `Hola ${data.name}, gracias por suscribirte a nuestras actualizaciones. Pronto recibirás noticias exclusivas.`;
    const html = /* exactamente tu HTML largo */ `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body>
  <div style="width:100%;max-width:600px;margin:1rem auto;background:#fff;padding:1rem;border-radius:.5rem">
    <img src="https://www.arxatec.net/assets/logo.png" alt="logo" width="150" style="margin:0 auto;display:block">
    <h1 style="font-size:1.2rem;color:#111827;font-weight:900;text-align:center;margin-top:2rem">¡Gracias por suscribirte a la lista de espera de Arxatec!</h1>
    <p style="font-size:.9rem;color:#4b5563">Hola ${data.name}, gracias por unirte. Te avisaremos del lanzamiento y recibirás novedades y contenido útil.</p>
    <a href="https://arxatec.vercel.app/es" style="text-decoration:none;margin:1.5rem 0; background:#2563eb; padding:.8rem 1rem; color:#fff; font-weight:600; border-radius:.3rem; display:block; text-align:center;">Ingresar a Arxatec</a>
    <p style="font-size:.75rem;color:#9ca3af">Si no enviaste tus datos a Arxatec, ignora este mensaje.</p>
  </div>
</body>
</html>
    `;

    await sendEmail(data.email, subject, text, html);

    return MESSAGES.WAITLIST.SUBSCRIBE_SUCCESS;
  }
}
