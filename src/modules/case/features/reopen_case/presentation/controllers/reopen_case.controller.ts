import { Response } from "express";
import { ReopenCaseService } from "../services/reopen_case.service";
import { ReopenCaseSchema } from "../../domain/dtos/reopen_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { ZodError } from "zod";

export class ReopenCaseController {
  constructor(private readonly svc = new ReopenCaseService()) {}

  reopen = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = ReopenCaseSchema.parse({ id });

      const [data, user] = await Promise.all([
        this.svc.execute(dto, req.user!),
        getAuthenticatedUser(req),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, "Case reopened", req.path, {
          case: data,
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
