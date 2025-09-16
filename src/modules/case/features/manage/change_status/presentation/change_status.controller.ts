// src/modules/cases/features/manage/change_status/presentation/change_status.controller.ts
import { Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { ZodError } from "zod";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { ChangeStatusService } from "./change_status.service";
import {
  ChangeStatusParamsSchema,
  ChangeStatusSchema,
} from "../domain/change_status.schema";

export class ChangeStatusController {
  constructor(private svc = new ChangeStatusService()) {}

  patch = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = ChangeStatusParamsSchema.parse(req.params);
      const dto = ChangeStatusSchema.parse(req.body);

      const user = await getAuthenticatedUser(req);

      const result = await this.svc.execute(id, dto, {
        id: String(user.id),
        role: user.user_type as "client" | "lawyer",
      });

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            HttpStatusCodes.OK.message,
            req.path,
            { case: result, user }
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
