// src/modules/cases/features/associations/attachments/create/presentation/create.controller.ts
import type { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { AppError } from "../../../../../../../utils/errors";
import { requireClientOrLawyer } from "../../../../../../../utils/authenticated_user";
import { CreateAttachmentSchema } from "../domain/create.schema";
import { createCaseAttachment } from "./create.service";

export async function upload(req: Request, res: Response): Promise<Response> {
  const caseId = String(req.params.id);

  const dto = CreateAttachmentSchema.omit({ file_key: true }).parse({
    caseId,
    ...req.body,
  });

  if (!req.file) {
    throw new AppError("File is required", HttpStatusCodes.BAD_REQUEST.code);
  }

  const user = await requireClientOrLawyer(req as any);

  const result = await createCaseAttachment(caseId, dto, req.file, user);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.CREATED.code,
        "Attachment uploaded",
        req.path,
        result
      )
    );
}
