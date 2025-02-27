import { sendEmail } from "../../../shared/utils/emailSender";
import { createUser as createUserRepository, loginUser as loginUserRepository } from '../data/repository/user.repository';
import { RegisterDTO } from '../domain/dtos/register.dto';
import { LoginDTO } from '../domain/dtos/login.dto';
import { User } from '@prisma/client';
import { generateVerificationToken, generateToken } from '../../../shared/config/jwt';

export const registerUser = async (data: RegisterDTO): Promise<User> => {
  try {
    const user = await createUserRepository(data);

    // Generar token de verificación
    const token = generateVerificationToken(user.email);

    // Enlace de verificación
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

    // Enviar correo de verificación
    await sendEmail(
      user.email,
      "Verifica tu cuenta",
      `Por favor, confirma tu cuenta haciendo clic en este enlace: ${verificationLink}`,
      `<h1>Verificación de cuenta</h1><p>Haz clic en el siguiente enlace para verificar tu cuenta:</p><a href="${verificationLink}">Verificar cuenta</a>`
    );

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al registrar el usuario: ${error.message}`);
    } else {
      throw new Error("Error desconocido al registrar el usuario");
    }
  }
};

export const loginUser = async (data: LoginDTO): Promise<{ user: User; token: string }> => {
  try {
    const user = await loginUserRepository(data);

    if (!user) throw new Error("Credenciales incorrectas");
    if (user.status !== "active") throw new Error("Debes verificar tu cuenta antes de iniciar sesión");

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.user_type,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    return { user, token };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    } else {
      throw new Error("Error desconocido al iniciar sesión");
    }
  }
};