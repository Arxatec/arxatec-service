// src/modules/auth/features/login/login_with_google/presentation/login_with_google.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { LoginGoogleService } from "./login_with_google.service";
import { LoginGoogleSchema } from "../domain/login_with_google.schema";

export class LoginGoogleController {
  constructor(private readonly loginGoogleService: LoginGoogleService) {}

  async loginWithGoogle(req: Request, res: Response): Promise<Response> {
    const data = LoginGoogleSchema.parse(req.body);
    const result = await this.loginGoogleService.loginWithGoogle(data);

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
}
