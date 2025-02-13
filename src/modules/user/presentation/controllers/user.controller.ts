import { Request, Response } from 'express';
import { registerUser, login } from '../../services/user.service';
import { RegisterDTO } from '../../domain/dtos/register.dto';
import { LoginDTO } from '../../domain/dtos/login.dto';

// Controlador de Registro
export const registerController = async (req: Request, res: Response) => {
  try {
    const userData: RegisterDTO = req.body;
    const user = await registerUser(userData);
    res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {  
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

// Controlador de Login
export const loginController = async (req: Request, res: Response) => {
  try {
    const loginData: LoginDTO = req.body;
    const user = await login(loginData);
    res.status(200).json({ message: 'Login exitoso', user });
  } catch (error: unknown) {
    if (error instanceof Error) { 
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};
