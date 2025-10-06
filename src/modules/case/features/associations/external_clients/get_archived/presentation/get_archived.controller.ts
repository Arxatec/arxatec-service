// src/modules/case/features/associations/external_clients/get_archived/presentation/get_archived.controller.ts
import type { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { getArchivedExternalClientsService } from "./get_archived.service";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";

export async function getArchived(
  req: Request,
  res: Response
): Promise<Response> {
  const authUser = await getAuthenticatedUser(req);
  const userDetailId = String(authUser.id);

  const clients = await getArchivedExternalClientsService(userDetailId);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Archived external clients",
        req.path,
        { clients, user: authUser }
      )
    );
}
