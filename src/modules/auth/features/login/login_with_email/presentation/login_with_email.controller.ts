//src/modules/auth/features/login/login_with_email/presentation/login_with_email.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { handleServerError } from "../../../../../../utils/error_handler";
import { LoginService } from "./login_with_email.service";
import { LoginSchema } from "../domain/login_with_email.schema";

export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  async login(req: Request, res: Response): Promise<Response> {
    const data = LoginSchema.parse(req.body);
    const result = await this.loginService.login(data);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Login successful",
          req.path,
          result
        )
      );
  }
}
