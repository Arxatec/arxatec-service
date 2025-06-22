import { Response } from "express";
import { ArchiveCaseService } from "../services/archive_case.service";
import { ArchiveCaseSchema } from "../../domain/dtos/archive_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { handleServerError, handleZodError } from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { ZodError } from "zod";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class ArchiveCaseController {
  constructor(private readonly svc = new ArchiveCaseService()) {}

  archive = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = ArchiveCaseSchema.parse({ id });

      const [result, user] = await Promise.all([
        this.svc.execute(dto, req.user!),
        getAuthenticatedUser(req),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, "Case archived", req.path, {
          archivedCase: result,
          user,
        })
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
