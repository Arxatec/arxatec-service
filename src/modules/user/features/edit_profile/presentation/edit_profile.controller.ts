// src/modules/user/features/edit_profile/presentation/edit_profile.controller.ts
import { Request, Response } from "express";
import { EditProfileSchema } from "../domain/edit_profile.schema";
import { editProfileService } from "./edit_profile.service";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";

export async function edit(req: Request, res: Response): Promise<Response> {
  const dto = EditProfileSchema.parse(req.body);
  const currentUser = await getAuthenticatedUser(req);
  const data = await editProfileService(dto, currentUser);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(HttpStatusCodes.OK.code, "Perfil actualizado", req.path, data)
    );
}

