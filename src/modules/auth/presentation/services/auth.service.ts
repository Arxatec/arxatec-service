// src/modules/auth/presentation/services/auth.service.ts

import { AuthRepository } from "../../data/repository/auth.repository";
import { RegisterDTO } from "../../domain/dtos/register.dto";
import { LoginDTO } from "../../domain/dtos/login.dto";
import { ForgotPasswordDTO } from "../../domain/dtos/forgot_password.dto";
import { ResetPasswordDTO } from "../../domain/dtos/reset_password.dto";
import { OnboardingDTO } from "../../domain/dtos/onboarding.dto";
import { User } from "../../domain/entities/user.entity";
import {
  generateCodeToken,
  verifyCodeToken,
  generateToken,
} from "../../../../config/jwt";
import { sendEmail } from "../../../../utils/email_sender";

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  // Registro de usuario y envío del código de verificación
  async registerUser(
    data: RegisterDTO
  ): Promise<{ user: User; token: string }> {
    const existingUser = await this.authRepository.getEmail(data.email);
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const user = await this.authRepository.createUser(data);

    // Generar el código y enviarlo por email
    const token = generateCodeToken(user.email, "verification");
    const { code } = verifyCodeToken(token) || {};

    if (!code) {
      throw new Error("Failed to generate verification code");
    }

    await sendEmail(
      user.email,
      "Verify your account",
      `Your verification code is: ${code}`
    );

    return { user, token };
  }

  // Verificación del código
  async verifyUserCode(token: string, code: string) {
    const payload = verifyCodeToken(token);

    if (!payload || payload.code !== code) {
      throw new Error("Invalid or expired verification code");
    }

    await this.authRepository.updateUserStatus(payload.email, "active");

    return { message: "User verified successfully" };
  }

  // Inicio de sesión
  async loginUser(data: LoginDTO): Promise<{ user: User; token: string }> {
    const user = await this.authRepository.getEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await this.authRepository.verifyPassword(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if (!user.isVerified()) {
      throw new Error("User is not verified");
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

  // Solicitar código de recuperación
  async requestPasswordReset(
    data: ForgotPasswordDTO
  ): Promise<{ message: string }> {
    const user = await this.authRepository.getEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }

    const token = generateCodeToken(user.email, "password_reset");
    const payload = verifyCodeToken(token);
    if (!payload || !payload.code) {
      throw new Error("Failed to generate recovery code");
    }

    await sendEmail(
      user.email,
      "Password Reset Code",
      `Your code is: ${payload.code}`
    );

    return { message: "A password reset code was sent to your email" };
  }

  // Verificar código y actualizar contraseña
  async resetPassword(data: ResetPasswordDTO): Promise<{ message: string }> {
    const payload = verifyCodeToken(data.token);

    if (!payload || payload.code !== data.code) {
      throw new Error("Invalid or expired code");
    }

    await this.authRepository.updateUserPassword(
      payload.email,
      data.new_password
    );

    return { message: "Password reset successfully" };
  }
//completar el onboarding
  async completeOnboarding(userId: number, data: OnboardingDTO) {
    const user = await this.authRepository.updateUserOnboarding(userId, data);
  
    if (data.user_type === "lawyer" && data.license_number) {
      await this.authRepository.createLawyerData(userId, data.license_number);
    } else if (data.user_type === "client") {
      await this.authRepository.createClientData(userId);
    }
  
    return { message: "Onboarding completed successfully", user };
  }
  
}
