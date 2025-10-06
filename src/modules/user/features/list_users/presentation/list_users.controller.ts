// src/modules/user/features/list_users/presentation/list_users.controller.ts
import { Request, Response } from "express";
import { ListUsersQuerySchema } from "../domain/list_users.schema";
import { listUsersService } from "./list_users.service";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../utils/build_http_response";

export async function list(req: Request, res: Response) {
  const query = ListUsersQuerySchema.parse(req.query);
  const data = await listUsersService(query);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Lista de usuarios obtenida correctamente",
        req.path,
        data
      )
    );
}
