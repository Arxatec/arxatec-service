// src/modules/case/domain/dtos/index.ts

// Exportar Zod schemas (objetos)
export { CreateCaseDto as CreateCaseSchema } from "./create_case.dto";
export { UpdateCaseDto as UpdateCaseSchema } from "./update_case.dto";
export { ChangeStatusCaseDto as ChangeStatusCaseSchema } from "./change_status_case.dto";
export { CreateCaseAttachmentDto as CreateCaseAttachmentSchema } from "./create_case_attachment.dto";
export { CreateExternalClientDto as CreateExternalClientSchema } from "./create_external_client.dto";
export { CreateCaseMessageSchema } from "./create_case_message.dto";

// Exportar tipos (solo con export type)
export type { CreateCaseDto } from "./create_case.dto";
export type { UpdateCaseDto } from "./update_case.dto";
export type { ChangeStatusCaseDto } from "./change_status_case.dto";
export type { CreateCaseAttachmentDto } from "./create_case_attachment.dto";
export type { CreateExternalClientDto } from "./create_external_client.dto";
export type { CreateCaseMessageDto } from "./create_case_message.dto";
