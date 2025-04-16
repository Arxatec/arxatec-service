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

    const subject = "Verify your account";
    const text = `Your verification code is: ${code}`;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
      <title>Código de verificación - Arxatec</title>
    </head>
    <body style="font-family: 'DM Sans', Arial, sans-serif; ">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

        @font-face {
          font-family: 'DM Sans';
          src: url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        }
      </style>

      <div style="width: 100%; max-width: 600px; margin: 1rem auto; background-color: #fff; padding: 1rem; border-radius: 0.5rem">
        <img src="https://www.arxatec.net/assets/logo.png" alt="logo" width="120" >
        <h1 style="font-size: 1rem; color: #111827; font-weight: 900; font-family: 'DM Sans', Arial, sans-serif; text-align: left; margin-top: 1rem; ">
          Código de verificación
        </h1>

        <p style="font-size: 0.8rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
        Para activar tu cuenta en Arxatec, utiliza el siguiente código de verificación. No compartas este código. Es exclusivo para completar tu registro correctamente.
        </p>
        <b style="font-size: 2rem; color: #4b5563; letter-spacing: 0.2rem; font-weight: 900; font-family: 'DM Sans', Arial, sans-serif; text-align: center; display: block; margin-top: 1rem">
          ${code}
        </b>

        <a href="https://arxatec-platform.vercel.app/verify-account?code=${code}" style="text-decoration: none; margin: 1.5rem 0rem; background-color: #2563eb;  padding: 0.8rem 1rem; color: #fff; font-family: 'DM Sans', Arial, sans-serif; font-weight: 600; border-radius: 0.3rem; display: block; font-size: 0.8rem; text-align: center; ">
          Confirmar y activar cuenta
        </a>
        <p style="font-size: 0.8rem; margin-top: 0.2rem; color: #4b5563; font-family: 'DM Sans', Arial, sans-serif;">
          Gracias por registrarte en Arxatec — Rafael Aguirre, Director de Operaciones (COO)
        </p>

        <div style="border-top: 1px solid #d1d5db; margin-top: 32px; padding-top: 10px; font-size: 12px; color: #9ca3af;">
          <p style="font-family: 'DM Sans', Arial, sans-serif;">
          Este es un mensaje automático del sistema de Arxatec. 
          </p> 
        </div>
      </div>
      </div>
    </body>
    </html>
    `;

    await sendEmail(user.email, subject, text, html);

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
