import {
  handleServerError,
  handleZodError,
} from "../../../../utils/error_handler";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants";
import { buildHttpResponse } from "../../../../utils";

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

import {
  OnboardingDTO,
  OnboardingSchema,
} from "../../domain/dtos/onboarding.dto";

import { AuthRepository } from "../../data/repository/auth.repository";

const authService = new AuthService(new AuthRepository());
interface AuthenticatedRequest extends Request {
  user?: { id: number };
}
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
            "User registered successfully. A verification code was sent to your email.",
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

  // Verificación del código
  async verifyCode(req: Request, res: Response): Promise<Response> {
    try {
      const { token, code } = req.body;
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

  // Inicio de sesión
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const data = LoginSchema.parse(req.body) as LoginDTO;
      const { user, token } = await authService.loginUser(data);

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Login successful",
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

  // Solicitar código de recuperación
  async requestPasswordReset(req: Request, res: Response): Promise<Response> {
    try {
      const data = ForgotPasswordSchema.parse(req.body) as ForgotPasswordDTO;
      const response = await authService.requestPasswordReset(data);

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

  // Verificar código y actualizar contraseña
  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const data = ResetPasswordSchema.parse(req.body) as ResetPasswordDTO;
      const response = await authService.resetPassword(data);

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
  //Endpoint para manejar el onboarding

  async completeOnboarding(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              req.path
            )
          );
      }

      const userId = req.user.id; // ✅ TypeScript ya reconoce `req.user.id`
      const data = OnboardingSchema.parse(req.body) as OnboardingDTO;

      const response = await authService.completeOnboarding(userId, data);

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            response.message,
            req.path,
            response.user
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
}
