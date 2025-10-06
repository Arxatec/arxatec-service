// src/modules/case/features/associations/external_clients/create/presentation/create.controller.ts
import type { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { CreateExternalClientSchema } from "../domain/create.schema";
import { createExternalClientService } from "./create.service";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";

export async function createExternalClient(
  req: Request,
  res: Response
): Promise<Response> {
  const dto = CreateExternalClientSchema.parse(req.body);

  const authUser = await getAuthenticatedUser(req);
  const userDetailId = String(authUser.id);

  const avatar = req.file as Express.Multer.File | undefined;

  const result = await createExternalClientService(dto, avatar, userDetailId);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.CREATED.code,
        "External client created",
        req.path,
        { client: result, user: authUser }
      )
    );
}
