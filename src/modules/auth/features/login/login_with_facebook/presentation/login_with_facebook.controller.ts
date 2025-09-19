// src/modules/auth/features/login/login_with_facebook/presentation/login_with_facebook.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { LoginFacebookSchema } from "../domain/login_with_facebook.schema";
import { loginWithFacebookLegacy } from "./login_with_facebook.service";

export const postLoginWithFacebook = async (req: Request, res: Response) => {
  const dto = LoginFacebookSchema.parse(req.body);
  const result = await loginWithFacebookLegacy(dto);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Login with Facebook successful",
        req.path,
        result
      )
    );
};
