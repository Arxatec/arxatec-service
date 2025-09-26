// src/modules/cases/features/create_case/presentation/controllers/create_case.controller.ts
import { Response } from "express";
import { CreateCaseService } from "./create_case.service";
import { CreateCaseSchema } from "../domain/create_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { handleServerError, handleZodError } from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { ZodError } from "zod";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class CreateCaseController {
  constructor(private readonly service = new CreateCaseService()) {}

  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const dto = CreateCaseSchema.parse(req.body);

      const user = await getAuthenticatedUser(req);

      const result = await this.service.execute(dto, {
        id: String(user.id),
        role: user.user_type as "client" | "lawyer",
      });

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(buildHttpResponse(HttpStatusCodes.CREATED.code, result.message, req.path, { case: result.case, user }));
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }
}
