// src/modules/client/features/get_detail/presentation/get_detail.controller.ts
import { Request, Response } from "express";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { AppError } from "../../../../../utils";
import { HttpStatusCodes } from "../../../../../constants";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { getDetailService } from "./get_detail.service";

export async function getDetail(req: Request, res: Response) {
  const user = await getAuthenticatedUser(req);
  const { id } = req.params;
  if (user.role !== "lawyer") {
    throw new AppError(
      "Solo abogados pueden ver esta información",
      HttpStatusCodes.FORBIDDEN.code
    );
  }

  const result = await getDetailService(id);

  return res.status(HttpStatusCodes.OK.code).json(
    buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, {
      ...result,
    })
  );
}
