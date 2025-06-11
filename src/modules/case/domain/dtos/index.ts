// src/modules/case/domain/dtos/index.ts

/* -----------------------------  Zod Schemas  ----------------------------- */
export { CreateCaseDto               as CreateCaseSchema }              from "./create_case.dto";
export { UpdateCaseDto               as UpdateCaseSchema }              from "./update_case.dto";
export { ChangeCaseStatusDto         as ChangeCaseStatusSchema }        from "./change_status_case.dto";
export { CreateCaseAttachmentDto     as CreateCaseAttachmentSchema }    from "./create_case_attachment.dto";
export { CreateCaseMessageDto        as CreateCaseMessageSchema }       from "./create_case_message.dto";
export { CreateConsultationDto       as CreateConsultationSchema }      from "./create_consultation.dto";
export { CreateExternalClientDto     as CreateExternalClientSchema }    from "./create_external_client.dto";
export { UpdateExternalClientSchema }                               from "./update_external_client.dto";

/* -------------------------------  Types  --------------------------------- */
export type { CreateCaseDtoType              as CreateCaseDto }              from "./create_case.dto";
export type { UpdateCaseDtoType              as UpdateCaseDto }              from "./update_case.dto";
export type { ChangeCaseStatusDtoType        as ChangeCaseStatusDto }        from "./change_status_case.dto";
export type { CreateCaseAttachmentDtoType    as CreateCaseAttachmentDto }    from "./create_case_attachment.dto";
export type { CreateCaseMessageDtoType       as CreateCaseMessageDto }       from "./create_case_message.dto";
export type { CreateConsultationDtoType      as CreateConsultationDto }      from "./create_consultation.dto";
export type { CreateExternalClientDtoType    as CreateExternalClientDto }    from "./create_external_client.dto";
export type { UpdateExternalClientDtoType    as UpdateExternalClientDto }    from "./update_external_client.dto";
