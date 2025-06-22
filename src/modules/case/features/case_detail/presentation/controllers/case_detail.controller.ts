import { Response } from "express";
import { ZodError } from "zod";
import { CaseDetailService } from "../services/case_detail.service";
import { CaseDetailParamsSchema } from "../../domain/dtos/case_detail.schema";
import { handleServerError, handleZodError } from "../../../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class CaseDetailController {
  constructor(private readonly service = new CaseDetailService()) {}

  get = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = CaseDetailParamsSchema.parse(req.params);

      const [data, user] = await Promise.all([
        this.service.execute(id, req.user!),
        getAuthenticatedUser(req),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(HttpStatusCodes.OK.code, HttpStatusCodes.OK.message, req.path, {
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
