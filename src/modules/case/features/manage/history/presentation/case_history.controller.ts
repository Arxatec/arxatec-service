// src/modules/cases/features/manage/history/presentation/case_history.controller.ts
import { Response } from "express";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { ZodError } from "zod";
import { GetCaseHistoryService } from "./case_history.service";
import { CaseHistoryParamsSchema } from "../domain/case_history.schema";

export class GetCaseHistoryController {
  constructor(private readonly svc = new GetCaseHistoryService()) {}

  getHistory = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = CaseHistoryParamsSchema.parse(req.params);

      const user = await getAuthenticatedUser(req);
      const data = await this.svc.execute(id, {
        id: String(user.id),
        role: user.user_type as "client" | "lawyer",
      });

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Case history retrieved",
          req.path,
          {
            history: data,
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
}
