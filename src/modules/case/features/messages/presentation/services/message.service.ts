import { MessageRepository } from "../../data/message.repository";
import { SendMessageDTO } from "../../domain/dtos/send_message.dto";
import { AppError } from "../../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";
import { io } from "../../../../../../config/socket";
import { NotificationService } from "../../../../../notification/presentation/services/notification.service";
import { NotificationRepository } from "../../../../../notification/data/repository/notification.repository";

type CurrentUser = { id: number; role: "client" | "lawyer" };

export class MessageService {
  constructor(
    private readonly repo = new MessageRepository(),
    private readonly notifier = new NotificationService(
      new NotificationRepository()
    )
  ) {}

  async send(caseId: number, dto: SendMessageDTO, user: CurrentUser) {
    const found = await this.repo.findCaseById(caseId);
    if (!found) {
      throw new AppError(
        CASE_MESSAGES.NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (found.archived) {
      throw new AppError(
        "El caso está archivado",
        HttpStatusCodes.CONFLICT.code
      );
    }

    const clientId = found.service?.client_id;
    const lawyerId = found.service?.lawyer_id;

    if (!lawyerId) {
      throw new AppError(
        "Un abogado debe estar asignado",
        HttpStatusCodes.CONFLICT.code
      );
    }

    if (
      (user.role === "client" && clientId !== user.id) ||
      (user.role === "lawyer" && lawyerId !== user.id)
    ) {
      throw new AppError(
        CASE_MESSAGES.ACCESS_DENIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const message = await this.repo.createMessage({
      service: { connect: { id: found.service_id } },
      content: dto.content,
      sent_by: user.role,
      is_read: false,
    });

    const receiverId = user.role === "client" ? lawyerId : clientId;

    if (receiverId) {
      await this.notifier.createNotification({
        title: CASE_MESSAGES.MESSAGE_SENT,
        description: `Nuevo mensaje en el caso “${found.title}”`,
        type: "info",
        receiverId,
        senderId: user.id,
        url: `/case/${caseId}`,
      });

      io.to(`user:${receiverId}`).emit("CASE_NEW_MESSAGE", {
        caseId,
        messageId: message.id,
        content: message.content,
      });
    }

    return message;
  }
}
