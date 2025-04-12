// src/modules/auth/presentation/services/auth.service.ts

import { AuthRepository } from "../../data/repository/auth.repository";
import { RegisterDTO } from "../../domain/dtos/register.dto";
import { LoginDTO } from "../../domain/dtos/login.dto";
import { ForgotPasswordDTO } from "../../domain/dtos/forgot_password.dto";
import { ResetPasswordDTO } from "../../domain/dtos/reset_password.dto";
import { User } from "../../domain/entities/user.entity";
import {
  generateCodeToken,
  verifyCodeToken,
  generateToken,
} from "../../../../config/jwt";
import { sendEmail } from "../../../../utils/email_sender";
import { AppError } from "../../../../utils";
import { MESSAGES, HttpStatusCodes } from "../../../../constants";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  // Registro de usuario y envío del código de verificación
  async registerUser(
    data: RegisterDTO
  ): Promise<{ user: User; token?: string; message: string }> {
    const existingUser = await this.authRepository.getEmail(data.email);

    // Si ya existe y está activo
    if (existingUser && existingUser.status === "active") {
      throw new AppError(
        MESSAGES.AUTH.EMAIL_IN_USE_VERIFIED,
        HttpStatusCodes.CONFLICT.code
      );
    }

    // Si ya existe y está pendiente
    if (existingUser && existingUser.status === "pending") {
      const newToken = generateCodeToken(existingUser.email, "verification");

      // Intentamos verificar el token recién generado para extraer su payload
      const payload = verifyCodeToken(newToken);

      if (!payload?.code) {
        throw new AppError(
          MESSAGES.AUTH.CODE_GENERATION_FAILED,
          HttpStatusCodes.INTERNAL_SERVER_ERROR.code
        );
      }

      try {
        // Enviamos nuevo código si llegó hasta aquí
        await sendEmail(
          existingUser.email,
          "Verify your account",
          `Your verification code is: ${payload.code}`
        );

        return {
          user: existingUser,
          token: newToken,
          message: MESSAGES.AUTH.EMAIL_IN_USE_PENDING_RESENT,
        };
      } catch (error) {
        throw new AppError(
          "Failed to send verification email",
          HttpStatusCodes.INTERNAL_SERVER_ERROR.code
        );
      }
    }

    // Si no existe, crear usuario nuevo
    const user = await this.authRepository.createUser(data);
    const token = generateCodeToken(user.email, "verification");

    const { code } = verifyCodeToken(token) || {};
    if (!code) {
      throw new AppError(
        MESSAGES.AUTH.CODE_GENERATION_FAILED,
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }

    await sendEmail(
      user.email,
      "Verify your account",
      `Your verification code is: ${code}`
    );

    return {
      user,
      token,
      message: MESSAGES.AUTH.USER_REGISTERED_SUCCESS,
    };
  }

  // Verificación de cuenta con código y token desde headers
  async verifyUserCode(
    authorization: string | undefined,
    code: string
  ): Promise<{ message: string }> {
    if (!authorization) {
      throw new AppError(
        "Authorization header missing",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    const token = authorization.replace("Bearer ", "");
    const payload = verifyCodeToken(token);
    if (!payload || payload.code !== code || payload.type !== "verification") {
      throw new AppError(
        MESSAGES.AUTH.INVALID_VERIFICATION_CODE,
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    await this.authRepository.updateUserStatus(payload.email, "active");
    return { message: MESSAGES.AUTH.USER_VERIFIED };
  }

  // Inicio de sesión
  async loginUser(data: LoginDTO): Promise<{ user: User; token: string }> {
    const user = await this.authRepository.getEmail(data.email);
    if (!user) {
      throw new AppError(
        MESSAGES.AUTH.INVALID_CREDENTIALS,
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    const isPasswordValid = await this.authRepository.verifyPassword(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError(
        MESSAGES.AUTH.INVALID_CREDENTIALS,
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    if (!user.isVerified()) {
      throw new AppError(
        MESSAGES.AUTH.USER_NOT_VERIFIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.first_name,
      last_name: user.last_name,
      status: user.status,
      user_type: user.user_type,
    });

    return { user, token };
  }

  // Solicitud de recuperación de contraseña
  async requestPasswordReset(
    data: ForgotPasswordDTO
  ): Promise<{ message: string; token?: string }> {
    const user = await this.authRepository.getEmail(data.email);

    if (!user) {
      throw new AppError(
        MESSAGES.AUTH.USER_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND.code
      );
    }

    if (!user.isVerified()) {
      throw new AppError(
        MESSAGES.AUTH.USER_NOT_VERIFIED,
        HttpStatusCodes.FORBIDDEN.code
      );
    }

    const token = generateCodeToken(user.email, "password_reset");

    const payload = verifyCodeToken(token);
    if (!payload || !payload.code) {
      throw new AppError(
        MESSAGES.AUTH.CODE_GENERATION_FAILED,
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }

    try {
      await sendEmail(
        user.email,
        "Password Reset Code",
        `Your code is: ${payload.code}`,
        `<h1>Password Reset</h1><p>Your code is: <strong>${payload.code}</strong></p>`
      );

      return {
        message: MESSAGES.AUTH.PASSWORD_RESET_CODE_SENT,
        token,
      };
    } catch {
      throw new AppError(
        "Failed to send password reset email",
        HttpStatusCodes.INTERNAL_SERVER_ERROR.code
      );
    }
  }

  // Verificación de código y cambio de contraseña
  async resetPassword(
    authorization: string | undefined,
    data: ResetPasswordDTO
  ): Promise<{ message: string }> {
    if (!authorization) {
      throw new AppError(
        "Authorization header missing",
        HttpStatusCodes.UNAUTHORIZED.code
      );
    }

    const token = authorization.replace("Bearer ", "");
    const payload = verifyCodeToken(token);

    if (
      !payload ||
      payload.code !== data.code ||
      payload.type !== "password_reset"
    ) {
      throw new AppError(
        MESSAGES.AUTH.INVALID_RESET_CODE,
        HttpStatusCodes.BAD_REQUEST.code
      );
    }

    await this.authRepository.updateUserPassword(
      payload.email,
      data.new_password
    );
    return { message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESS };
  }
}
