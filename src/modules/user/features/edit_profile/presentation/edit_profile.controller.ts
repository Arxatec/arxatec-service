// src/modules/user/features/edit_profile/presentation/edit_profile.controller.ts
import { Response } from "express";
import { EditProfileSchema } from "../domain/edit_profile.schema";
import { EditProfileService } from "./edit_profile.service";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { AuthenticatedRequest } from "../../../../../middlewares/authenticate_token";

export class EditProfileController {
  constructor(private readonly svc = new EditProfileService()) {}

  async handle(req: AuthenticatedRequest, res: Response) {
    const dto = EditProfileSchema.parse(req.body);
    const currentUser = await getAuthenticatedUser(req);
    const data = await this.svc.execute(dto, currentUser);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Perfil actualizado",
          req.path,
          data
        )
      );
  }
}
