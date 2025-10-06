// src/modules/case/features/associations/external_clients/restore/presentation/restore.controller.ts
import type { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";
import { RestoreExternalClientParamsSchema } from "../domain/restore.schema";
import { restoreExternalClientService } from "./restore.service";

export async function restoreExternalClient(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = RestoreExternalClientParamsSchema.parse(req.params);

  const authUser = await getAuthenticatedUser(req);
  const userDetailId = String(authUser.id);

  const result = await restoreExternalClientService(id, userDetailId);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "External client restored",
        req.path,
        { client: result, user: authUser }
      )
    );
}
