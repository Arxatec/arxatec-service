// src/modules/lawyer/features/get_lawyers/presentation/get_lawyers.controller.ts
import { Request, Response } from "express";
import { GetLawyersQuerySchema } from "../domain/get_lawyers.schema";
import { getLawyersService } from "./get_lawyers.service";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants";
import { buildHttpResponse } from "../../../../../utils/build_http_response";

export async function list(req: Request, res: Response) {
  const user = await getAuthenticatedUser(req);
  if (user.role !== "client") {
    throw new AppError(
      "Solo clientes pueden ver esta información",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const query = GetLawyersQuerySchema.parse(req.query);
  const result = await getLawyersService(query);

  return res.status(HttpStatusCodes.OK.code).json(
    buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, {
      items: result.items,
      meta: result.meta,
    })
  );
}
