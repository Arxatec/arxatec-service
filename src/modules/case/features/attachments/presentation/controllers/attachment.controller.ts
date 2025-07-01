import { Response } from "express";
import { AttachmentService } from "../services/attachment.service";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { AddAttachmentSchema } from "../../domain/dtos/add_attachment.schema";
import { ZodError } from "zod";
import { AppError } from "../../../../../../utils/errors";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class AttachmentController {
  constructor(private readonly svc = new AttachmentService()) {}

  add = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const caseId = Number(req.params.id);
      const dto = AddAttachmentSchema.omit({ file_key: true }).parse({
        caseId,
        ...req.body,
      });

      if (!req.file) {
        throw new AppError(
          "File is required",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      const user = await getAuthenticatedUser(req);

      const newUser = {
        id: user?.id!,
        role: user?.user_type! as "client" | "lawyer",
      };

      const result = await this.svc.add(caseId, dto, req.file, newUser);

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          "Attachment uploaded",
          req.path,
          {
            attachment: result,
            user,
          }
        )
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const z = handleZodError(err, req);
        return res.status(z.status).json(z);
      }
      return handleServerError(res, req, err);
    }
  };

  list = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const caseId = Number(req.params.id);

      const user = await getAuthenticatedUser(req);

      const newUser = {
        id: user?.id!,
        role: user?.user_type! as "client" | "lawyer",
      };

      const result = await this.svc.list(caseId, newUser);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Attachments listed",
          req.path,
          {
            attachments: result,
            user,
          }
        )
      );
    } catch (err) {
      return handleServerError(res, req, err);
    }
  };

  archive = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const caseId = Number(req.params.id);
      const attId = Number(req.params.attId);

      const user = await getAuthenticatedUser(req);

      const newUser = {
        id: user?.id!,
        role: user?.user_type! as "client" | "lawyer",
      };

      const result = await this.svc.archive(caseId, attId, newUser);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Attachment archived",
          req.path,
          {
            archivedAttachment: result,
            user,
          }
        )
      );
    } catch (err) {
      return handleServerError(res, req, err);
    }
  };
}
