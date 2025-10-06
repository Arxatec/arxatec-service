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

  if (!serviceId) {
    throw new AppError(
      "El caso no tiene un service asociado",
      HttpStatusCodes.CONFLICT.code
    );
  }

  if (!lawyerId) {
    throw new AppError(
      "Un abogado debe estar asignado",
      HttpStatusCodes.CONFLICT.code
    );
  }

  const isClientAndOwner = user.role === "client" && clientId === user.id;
  const isLawyerAndOwner = user.role === "lawyer" && lawyerId === user.id;

  if (!isClientAndOwner && !isLawyerAndOwner) {
    throw new AppError(
      CASE_MESSAGES.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const created = await createMessageRepo({
    serviceId,
    content: dto.content,
    sentBy: user.role,
  });

  const receiverId = user.role === "client" ? lawyerId : clientId;

  if (receiverId) {
    // Notificación al receptor
    await createNotificationService({
      title: CASE_MESSAGES.MESSAGE_SENT,
      description: `Nuevo mensaje en el caso “${found.title}”`,
      type: "info",
      receiverId,
      senderId: user.id,
      url: `/case/${caseId}`,
    });

    // Evento en tiempo real para el receptor
    io.to(`user:${receiverId}`).emit("CASE_NEW_MESSAGE", {
      caseId,
      messageId: created.id,
      content: created.content,
    });
  }

  const message: MessageItem = {
    id: created.id,
    serviceId: created.service_id,
    content: created.content,
    sent_by: created.sent_by as MessageItem["sent_by"],
    is_read: created.is_read,
    created_at: created.created_at,
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

  const isClientAndOwner = user.role === "client" && clientId === user.id;
  const isLawyerAndOwner = user.role === "lawyer" && lawyerId === user.id;

  if (!isClientAndOwner && !isLawyerAndOwner) {
    throw new AppError(
      CASE_MESSAGES.ACCESS_DENIED,
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  if (!serviceId) {
    return { message: "Messages fetched successfully", data: { messages: [] } };
  }

  const rows = await getMessagesByServiceIdRepo(serviceId);

  const messages: MessageItem[] = rows.map((m) => ({
    id: m.id,
    serviceId: m.service_id,
    content: m.content,
    sent_by: m.sent_by as MessageItem["sent_by"],
    is_read: m.is_read,
    created_at: m.created_at,
  }));

  return {
    message: "Messages fetched successfully",
    data: { messages },
  };
}
