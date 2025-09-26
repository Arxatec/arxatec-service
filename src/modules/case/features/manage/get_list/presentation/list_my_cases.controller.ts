// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.controller.ts
import { Response } from "express";
import { ListMyCasesService } from "./list_my_cases.service";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { ZodError } from "zod";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user";
import { ListMyCasesQuerySchema } from "../domain/list_my_cases.schema";

export class ListMyCasesController {
  constructor(private readonly service = new ListMyCasesService()) {}

  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const query = ListMyCasesQuerySchema.parse(req.query);

      const user = await getAuthenticatedUser(req);
      const result = await this.service.execute(
        { id: String(user.id), role: user.user_type as "client" | "lawyer" },
        query
      );

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          {
            cases: result.items,
            meta: result.meta,
            user,
          }
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }
}
