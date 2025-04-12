// src/modules/auth/presentation/controllers/auth.controller.ts

import {
  handleServerError,
  handleZodError,
} from "../../../../utils/error_handler";
import { ZodError } from "zod";
import { HttpStatusCodes, MESSAGES } from "../../../../constants";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDTO, RegisterSchema } from "../../domain/dtos/register.dto";
import { LoginDTO, LoginSchema } from "../../domain/dtos/login.dto";
import {
  ForgotPasswordDTO,
  ForgotPasswordSchema,
} from "../../domain/dtos/forgot_password.dto";
import {
  ResetPasswordDTO,
  ResetPasswordSchema,
} from "../../domain/dtos/reset_password.dto";
import { AuthRepository } from "../../data/repository/auth.repository";

const authService = new AuthService(new AuthRepository());

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const data = RegisterSchema.parse(req.body) as RegisterDTO;
      const { user, token } = await authService.registerUser(data);
      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            MESSAGES.AUTH.USER_REGISTERED_SUCCESS,
            req.path,
            { user, token }
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }

  async verifyCode(req: Request, res: Response): Promise<Response> {
    try {
      const code = req.body.code;
      const token = req.headers.authorization;
      const result = await authService.verifyUserCode(token, code);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(HttpStatusCodes.OK.code, result.message, req.path)
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const data = LoginSchema.parse(req.body) as LoginDTO;
      const { user, token } = await authService.loginUser(data);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.AUTH.LOGIN_SUCCESS,
            req.path,
            { user, token }
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }

  async requestPasswordReset(req: Request, res: Response): Promise<Response> {
    try {
      const data = ForgotPasswordSchema.parse(req.body) as ForgotPasswordDTO;
      const response = await authService.requestPasswordReset(data);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            response.message,
            req.path,
            { token: response.token }
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const data = ResetPasswordSchema.parse(req.body) as ResetPasswordDTO;
      const token = req.headers.authorization;
      const response = await authService.resetPassword(token, data);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(HttpStatusCodes.OK.code, response.message, req.path)
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
}
