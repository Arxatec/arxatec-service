// src/modules/cases/features/associations/attachments/create/presentation/create.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { AppError } from "../../../../../../../utils/errors";
import { CreateAttachmentSchema } from "../domain/create.schema";
import { CreateAttachmentService } from "./create.service";
import { requireClientOrLawyer } from "../../../../../../../utils/authenticated_user";

export class CreateAttachmentController {
  constructor(private readonly svc = new CreateAttachmentService()) {}

  create = async (req: Request, res: Response) => {
    const caseId = String(req.params.id);
    const dto = CreateAttachmentSchema.omit({ file_key: true }).parse({
      caseId,
      ...req.body,
    });

    if (!req.file) {
      throw new AppError("File is required", HttpStatusCodes.BAD_REQUEST.code);
    }

    const user = await requireClientOrLawyer(req as any);
    const result = await this.svc.create(caseId, dto, req.file, user);

    return res
      .status(HttpStatusCodes.CREATED.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          "Attachment uploaded",
          req.path,
          { attachment: result, user }
        )
      );
  };
}
