// src/modules/auth/features/login/login_with_google/presentation/login_with_google.controller.ts
import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  LoginGoogleSchema,
  OAuthStateSchema,
} from "../domain/login_with_google.schema";
import { loginWithGoogleLegacy } from "./login_with_google.service";

export class LoginWithGoogleController {
  async postLoginWithGoogle(req: Request, res: Response): Promise<Response> {
    const dto = LoginGoogleSchema.parse(req.body);
    const result = await loginWithGoogleLegacy(dto);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Login with Google successful",
          req.path,
          result
        )
      );
  }

  validateOAuthState(req: Request, _res: Response, next: NextFunction) {
    OAuthStateSchema.parse(req.query);
    next();
  }
}
