import { Request, Response } from "express";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../../constants";
import { AppError, buildHttpResponse } from "../../../../../utils";
import {
  handleServerError,
  handleZodError,
} from "../../../../../utils/error_handler";
import { LoginService } from "./login.service";
import { LoginSchema } from "../domain/login.schema";

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
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json(buildHttpResponse(error.statusCode, error.message, req.path));
      }
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
}
