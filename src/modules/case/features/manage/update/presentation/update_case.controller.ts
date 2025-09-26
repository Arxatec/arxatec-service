// src/modules/cases/features/manage/update_case/presentation/update_case.controller.ts
import { Response } from "express";
import { UpdateCaseService } from "./update_case.service";
import {
  UpdateCaseSchema,
  UpdateCaseParamsSchema,
} from "../domain/update_case.schema";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user";
import { ZodError } from "zod";

export class UpdateCaseController {
  constructor(private readonly service = new UpdateCaseService()) {}

  patch = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = UpdateCaseParamsSchema.parse(req.params);
      const dto = UpdateCaseSchema.parse(req.body);

      const user = await getAuthenticatedUser(req);

      const data = await this.service.execute(
        id,
        {
          ...dto,
        },
        {
          id: String(user.id),
          role: user.user_type as "client" | "lawyer",
        }
      );

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
