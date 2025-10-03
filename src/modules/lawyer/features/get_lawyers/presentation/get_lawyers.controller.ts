// src/modules/lawyer/features/get_lawyers/presentation/get_lawyers.controller.ts
import { Request, Response } from "express";
import { GetLawyersService } from "./get_lawyers.service";
import { GetLawyersQuerySchema } from "../domain/get_lawyers.schema";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { AppError } from "../../../../../utils/errors";

export class GetLawyersController {
  constructor(private svc = new GetLawyersService()) {}

  getAll = async (req: Request, res: Response) => {
    const user = await getAuthenticatedUser(req);

    if (user.role !== "client") {
      throw new AppError(
        "Solo clientes pueden ver esta información",
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const { search, page, limit } = GetLawyersQuerySchema.parse(req.query);
    const result = await this.svc.getAll({ search, page, limit });

    return res.status(HttpStatusCodes.OK.code).json(
      buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, {
        lawyers: result.items,
        pagination: result.meta,
      })
    );
  };
}
