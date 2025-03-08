// src/modules/user/services/user.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { sendEmail } from "../../../../shared/utils/emailSender";
import { User } from "@prisma/client";

import { RegisterDTO } from "../../domain/dtos/register.dto";
import { LoginDTO } from "../../domain/dtos/login.dto";
import { ForgotPasswordDTO } from "../../domain/dtos/forgot_password.dto";
import { ResetPasswordDTO } from '../../domain/dtos/reset_password.dto';

import {createUser as createUserRepository,
        loginUser as loginUserRepository,
        findUserByEmail,
        updateUserPassword } from "../../data/repository/user.repository";

import {generateVerificationToken,
        generateToken,
        generateResetPasswordToken } from "../../../../shared/config/jwt";

const JWT_SECRET = process.env.JWT_SECRET as string;
const getBaseUrl = () => {
  const PORT = process.env.PORT;
  return process.env.APP_URL || `http://localhost:${PORT}`;
};

//Registro de usuario con verificación por email
export const registerUser = async (data: RegisterDTO): Promise<User> => {
  try {
    const user = await createUserRepository(data);
    const token = generateVerificationToken(user.email);
    const verificationLink = `${getBaseUrl()}/api/v1/auth/verify_email?token=${token}`;

    await sendEmail(
      user.email,
      "Verifica tu cuenta",
      `Por favor, confirma tu cuenta haciendo clic en este enlace: ${verificationLink}`,
      `<h1>Verificación de cuenta</h1><p>Haz clic en el siguiente enlace para verificar tu cuenta:</p><a href="${verificationLink}">Verificar cuenta</a>`
    );

    return user;
  } catch (error) {
    throw new Error(error instanceof Error ? `Error al registrar el usuario: ${error.message}` : "Error desconocido al registrar el usuario");
  }
};
//Inicio de sesión con validación de cuenta
export const loginUser = async (data: LoginDTO): Promise<{ user: User; token: string }> => {
  try {
    const user = await loginUserRepository(data);
    if (!user) throw new Error("Credenciales incorrectas");
    if (user.status !== "active") throw new Error("Debes verificar tu cuenta antes de iniciar sesión");

    const token = generateToken({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      first_name: user.first_name,
      last_name: user.last_name,
      status: user.status, 
    });

    return { user, token };
  } catch (error) {
    throw new Error(error instanceof Error ? `Error al iniciar sesión: ${error.message}` : "Error desconocido al iniciar sesión");
  }
};
// Recuperación de contraseña con un token
export const forgotPassword = async (data: ForgotPasswordDTO): Promise<string> => {
  const user = await findUserByEmail(data.email);
  if (!user) {
    return "No se encontró el correo o no existe, inténtelo de nuevo.";
  }

  const token = generateResetPasswordToken(user.email, "5m");
  const resetPasswordLink = `${getBaseUrl()}/api/v1/auth/reset_password?token=${token}`;

  const subject = "Recuperación de contraseña";
  const text = `Tu código de recuperación es: ${token}. Este código expira en 5 minutos.`;
  const html = `
    <h1>Recuperación de contraseña</h1>
    <p>Tu código de recuperación es: <strong>${token}</strong></p>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="${resetPasswordLink}">Restablecer contraseña</a>
    <p>Este enlace expira en 5 minutos. Si no solicitaste este cambio, ignora este mensaje.</p>
  `;
  await sendEmail(user.email, subject, text, html);

  return "Se envió un código de recuperación a tu correo.";
};
//Restablecimiento de contraseña con validación
export const resetPassword = async (data: ResetPasswordDTO): Promise<string> => {

  if (data.newPassword !== data.confirmPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  let payload: any;
  try {
    payload = jwt.verify(data.token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }

  const { email } = payload;
  if (!email) {
    throw new Error("Token inválido: no se encontró el email");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await updateUserPassword(email, hashedPassword);
  return "Contraseña actualizada exitosamente";
};