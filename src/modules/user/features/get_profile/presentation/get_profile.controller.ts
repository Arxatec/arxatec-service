// src/modules/user/features/get_profile/presentation/get_profile.controller.ts
import { Response } from "express";
import { GetProfileService } from "./get_profile.service";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { AuthenticatedRequest } from "../../../../../middlewares/authenticate_token";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";

export class GetProfileController {
  constructor(private readonly svc = new GetProfileService()) {}

  async handle(req: AuthenticatedRequest, res: Response) {
    const currentUser = await getAuthenticatedUser(req);
    const data = await this.svc.execute(currentUser);

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
}
