// src/modules/case/features/associations/external_clients/update/presentation/update.controller.ts
import type { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { UpdateExternalClientSchema } from "../domain/update.schema";
import { UpdateExternalClientParamsSchema } from "../domain/update.params.schema";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";
import { updateExternalClientService } from "./update.service";

export async function updateExternalClient(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = UpdateExternalClientParamsSchema.parse(req.params);
  const dto = UpdateExternalClientSchema.parse(req.body);

  const authUser = await getAuthenticatedUser(req);
  const userDetailId = String(authUser.id);

  const avatar = req.file as Express.Multer.File | undefined;

  const result = await updateExternalClientService(
    id,
    dto,
    avatar,
    userDetailId
  );

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "External client updated",
        req.path,
        { client: result, user: authUser }
      )
    );
}
