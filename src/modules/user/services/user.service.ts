import { createUser as createUserRepository, loginUser as loginUserRepository } from '../data/repository/user.repository';
import { RegisterDTO } from '../domain/dtos/register.dto';
import { LoginDTO } from '../domain/dtos/login.dto';
import { user } from '@prisma/client';
import { generateToken } from '../../../shared/config/jwt';

export const registerUser = async (data: RegisterDTO): Promise<user> => {
  try {
    if (!data.email || !data.password_hash || !data.first_name || !data.last_name || !data.role) {
      throw new Error('Faltan campos obligatorios');
    }

    const user = await createUserRepository(data);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al registrar el usuario: ${error.message}`);
    } else {
      throw new Error('Error desconocido al registrar el usuario');
    }
  }
};

export const loginUser = async (data: LoginDTO): Promise<{ user: user; token: string }> => {
  try {
    const user = await loginUserRepository(data);

    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Generar el token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    return { user, token };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    } else {
      throw new Error('Error desconocido al iniciar sesión');
    }
  }
};