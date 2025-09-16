// src/modules/cases/features/manage/case_detail/presentation/case_detail.controller.ts
import { Response } from "express";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { ZodError } from "zod";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { CaseDetailService } from "./case_detail.service";
import { CaseDetailParamsSchema } from "../domain/case_detail.schema";

export class CaseDetailController {
  constructor(private readonly service = new CaseDetailService()) {}

  get = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = CaseDetailParamsSchema.parse(req.params);
      const user = await getAuthenticatedUser(req);

      const data = await this.service.execute(id, {
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
            { case: data, user }
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
