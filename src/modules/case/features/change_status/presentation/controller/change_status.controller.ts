import { Response } from "express";
import { ZodError } from "zod";

import { ChangeStatusService } from "../services/change_status.service";
import { ChangeStatusSchema } from "../../domain/dtos/change_status.schema";
import { HttpStatusCodes } from "../../../../../../constants";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class ChangeStatusController {
  constructor(private svc = new ChangeStatusService()) {}

  patch = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id  = Number(req.params.id);
      const dto = ChangeStatusSchema.parse(req.body);

      const [result, user] = await Promise.all([
        this.svc.execute(id, dto, req.user!),
        getAuthenticatedUser(req),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          {
            case: result,
            user,
          },
        ),
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
