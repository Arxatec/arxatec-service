import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { handleServerError } from "../../../../../../utils/error_handler";
import { LoginService } from "./login_with_email.service";
import { LoginSchema } from "../domain/login_with_email.schema";

export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  async login(req: Request, res: Response): Promise<Response> {
    try {
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
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
