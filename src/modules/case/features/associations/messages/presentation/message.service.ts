// src/modules/case/features/messages/presentation/messages.service.ts
import {
  CurrentUser,
  GetHistoryResponse,
  MessageItem,
  SendMessageRequest,
  SendMessageResponse,
} from "../domain/message.payload";
import {
  createMessageRepo,
  findCaseByIdRepo,
  getMessagesByServiceIdRepo,
} from "../data/message.repository";
import { AppError } from "../../../../../../utils";
import { HttpStatusCodes } from "../../../../../../constants";
import { io } from "../../../../../../config/socket";
import { CASE_MESSAGES } from "../../../../../../constants/messages/case";

import { createNotificationService } from "../../../../../notification/presentation/notification.service";

export async function sendMessageService(
  caseId: string,
  dto: SendMessageRequest,
  user: CurrentUser
): Promise<SendMessageResponse> {
  if (!dto.content || dto.content.trim().length === 0) {
    throw new AppError(
      "El contenido del mensaje no puede estar vacío",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  if (dto.content.length > 2000) {
    throw new AppError(
      "El mensaje es demasiado largo (máximo 2000 caracteres)",
      HttpStatusCodes.BAD_REQUEST.code
    );
  }

  const found = await findCaseByIdRepo(caseId);
  if (!found) {
    throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
  }

  if (found.archived) {
    throw new AppError("El caso está archivado", HttpStatusCodes.CONFLICT.code);
  }

  const clientId = found.service?.client_id;
  const lawyerId = found.service?.lawyer_id;

  if (!lawyerId) {
    throw new AppError(
      "Un abogado debe estar asignado",
      HttpStatusCodes.CONFLICT.code
    );
  }

  const isClientAndOwner = user.user_type === "client" && clientId === user.id;
  const isLawyerAndOwner = user.user_type === "lawyer" && lawyerId === user.id;

  if (!isClientAndOwner && !isLawyerAndOwner) {
    throw new AppError(
      CASE_MESSAGES.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const created = await createMessageRepo({
    caseId,
    content: dto.content,
    sentBy: user.user_type,
  });

  const receiverId = user.user_type === "client" ? lawyerId : clientId;

  const caseRoom = `case:${caseId}`;

  const fullName =
    created.sent_by === "client"
      ? `${found.service?.client?.user?.first_name || ""} ${
          found.service?.client?.user?.last_name || ""
        }`.trim()
      : `${found.service?.lawyer?.user?.first_name || ""} ${
          found.service?.lawyer?.user?.last_name || ""
        }`.trim();
  if (receiverId) {
    await createNotificationService({
      title: CASE_MESSAGES.MESSAGE_SENT,
      description: `Nuevo mensaje en el caso “${found.title}”`,
      type: "info",
      receiverId,
      senderId: user.id,
      url: `/case/${caseId}`,
    });

    io.to(caseRoom).emit("CASE_NEW_MESSAGE", {
      id: created.id,
      content: created.content,
      sent_by: created.sent_by as MessageItem["sent_by"],
      is_read: created.is_read,
      created_at: created.created_at,
      sent_name: fullName,
    });
  }

  const message: MessageItem = {
    id: created.id,
    content: created.content,
    sent_by: created.sent_by as MessageItem["sent_by"],
    is_read: created.is_read,
    created_at: created.created_at,
    sent_name: fullName,
  };

  return {
    message: "Message sent successfully",
    data: { message },
  };
}

export async function getMessageHistoryService(
  caseId: string,
  user: CurrentUser
): Promise<GetHistoryResponse> {
  const found = await findCaseByIdRepo(caseId);
  if (!found) {
    throw new AppError(CASE_MESSAGES.NOT_FOUND, HttpStatusCodes.NOT_FOUND.code);
  }

  if (found.archived) {
    throw new AppError("El caso está archivado", HttpStatusCodes.CONFLICT.code);
  }

  const clientId = found.service?.client_id;
  const lawyerId = found.service?.lawyer_id;
  const serviceId = found.service?.id;

  const isClientAndOwner = user.user_type === "client" && clientId === user.id;
  const isLawyerAndOwner = user.user_type === "lawyer" && lawyerId === user.id;

  if (!isClientAndOwner && !isLawyerAndOwner) {
    throw new AppError(
      CASE_MESSAGES.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  if (!serviceId) {
    return {
      message: "Messages fetched successfully",
      data: {
        messages: [],
      },
    };
  }

  const [rows] = await Promise.all([getMessagesByServiceIdRepo(found.id)]);

  const messages = rows.map((m) => ({
    id: m.id,
    content: m.content,
    sent_by: m.sent_by as MessageItem["sent_by"],
    is_read: m.is_read,
    created_at: m.created_at,
    sent_name:
      m.sent_by === "client"
        ? `${m.case?.service?.client?.user?.first_name || ""} ${
            m.case?.service?.client?.user?.last_name || ""
          }`.trim()
        : `${m.case?.service?.lawyer?.user?.first_name || ""} ${
            m.case?.service?.lawyer?.user?.last_name || ""
          }`.trim(),
  }));

  return {
    message: "Messages fetched successfully",
    data: {
      messages,
    },
  };
}
