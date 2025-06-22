// src/modules/cases/features/list_my_cases/presentation/controllers/list_my_cases.controller.ts
import { Response } from "express";
import { ListMyCasesService } from "../services/list_my_cases.service";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { ListMyCasesSchema } from "../../domain/list_my_cases.schema";
import { HttpStatusCodes } from "../../../../../../constants";
import { ZodError } from "zod";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";

export class ListMyCasesController {
  constructor(private readonly service = new ListMyCasesService()) {}

  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      ListMyCasesSchema.parse(req.query); // futura validación de filtros

      const [cases, user] = await Promise.all([
        this.service.execute(req.user!),
        getAuthenticatedUser(req),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          {
            cases,
            user,
          },
        ),
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
