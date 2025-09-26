// src/modules/cases/features/associations/attachments/archive/presentation/archive.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../../utils/authenticated_user";
import { ArchiveAttachmentService } from "./archive.service";
import { ArchiveAttachmentParamsSchema } from "../domain/archive.schema";

export class ArchiveAttachmentController {
  constructor(private readonly svc = new ArchiveAttachmentService()) {}

  archive = async (req: Request, res: Response) => {
    const { id, attId } = ArchiveAttachmentParamsSchema.parse(req.params);
    const user = await requireClientOrLawyer(req as any);

    const result = await this.svc.archive(id, attId, user);

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
  };
}
