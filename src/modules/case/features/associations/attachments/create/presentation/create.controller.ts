// src/modules/cases/features/associations/attachments/create/presentation/create.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { ZodError } from "zod";
import { handleZodError } from "../../../../../../../utils/error_handler";
import { AppError } from "../../../../../../../utils/errors";
import { CreateAttachmentSchema } from "../domain/create.schema";
import { CreateAttachmentService } from "./create.service";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";

export class CreateAttachmentController {
  constructor(private readonly svc = new CreateAttachmentService()) {}

  create = async (req: Request, res: Response) => {
    try {
      const caseId = String(req.params.id);
      const dto = CreateAttachmentSchema.omit({ file_key: true }).parse({
        caseId,
        ...req.body,
      });
      if (!req.file)
        throw new AppError(
          "File is required",
          HttpStatusCodes.BAD_REQUEST.code
        );

      const user = await getAuthenticatedUser(req as any);
      const result = await this.svc.create(caseId, dto, req.file, {
        id: String(user.id),
        role: user.user_type as "client" | "lawyer",
      });

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
    } catch (err) {
      if (err instanceof ZodError) {
        const z = handleZodError(err, req);
        return res.status(z.status).json(z);
      }
      throw err;
    }
  };
}
