// src/modules/cases/features/manage/archive/presentation/archive_case.controller.ts
import { Response } from "express";
import { ArchiveCaseService } from "./archive_case.service";
import { ArchiveCaseSchema } from "../domain/archive_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { ZodError } from "zod";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class ArchiveCaseController {
  constructor(private readonly svc = new ArchiveCaseService()) {}

  archive = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = String(req.params.id);
      const dto = ArchiveCaseSchema.parse({ id });

      const user = await getAuthenticatedUser(req);

      const result = await this.svc.execute(dto, {
        id: String(user.id),
        role: user.user_type as "client" | "lawyer",
      });

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Case archived",
            req.path,
            { archivedCase: result, user }
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
}
