// src/modules/cases/features/associations/attachments/archive/presentation/archive.controller.ts
import type { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../../utils/authenticated_user";
import { ArchiveAttachmentParamsSchema } from "../domain/archive.schema";
import { archiveAttachmentService } from "./archive.service";

export async function archive(req: Request, res: Response): Promise<Response> {
  const { id, attId } = ArchiveAttachmentParamsSchema.parse(req.params);
  const user = await requireClientOrLawyer(req as any);
  const result = await archiveAttachmentService(id, attId, user);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Attachment archived",
        req.path,
        { archivedAttachment: result, user }
      )
    );
}
