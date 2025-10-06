// src/modules/user/features/get_profile/presentation/get_profile.controller.ts
import { Request, Response } from "express";
import { getProfileService } from "./get_profile.service";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";

export async function getProfile(req: Request, res: Response): Promise<Response> {
  const currentUser = await getAuthenticatedUser(req);
  const currentUserId = currentUser.id;

  const data = await getProfileService(currentUserId);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Perfil obtenido correctamente",
        req.path,
        data
      )
    );
}
