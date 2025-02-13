import { createUser, loginUser } from '../data/repository/user.repository';
import { RegisterDTO } from '../domain/dtos/register.dto';
import { LoginDTO } from '../domain/dtos/login.dto';

export const registerUser = async (data: RegisterDTO) => {
  return await createUser(data);
};

export const login = async (data: LoginDTO) => {
  const user = await loginUser(data);
  if (!user) {
    throw new Error('Credenciales incorrectas');
  }
  return user;
};
