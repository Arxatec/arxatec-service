// src/modules/user/presentation/controllers/user.controller.ts
import { Request, Response } from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword  } from '../services/user.service';
import { RegisterDTO } from '../../domain/dtos/register.dto';
import { LoginDTO } from '../../domain/dtos/login.dto';

import { ForgotPasswordSchema  } from "../../domain/dtos/forgot_password.dto";
import { ResetPasswordSchema } from "../../domain/dtos/reset_password.dto";



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
  
export const loginController = async (req: Request, res: Response) => {
  try {
    const loginData: LoginDTO = req.body;
    const { user, token } = await loginUser(loginData);

    if (user) {
      res.status(200).json({ message: 'Login exitoso', user, token });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const data = ForgotPasswordSchema.parse(req.body);
    const resultMessage = await forgotPassword(data);

    res.status(200).json({ message: resultMessage });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
};


export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.query.token as string;
    if (!token) {
      res.status(400).json({ error: "Token no proporcionado en la query." });
      return;
    }
    const { newPassword, confirmPassword } = ResetPasswordSchema.omit({ token: true }).parse(req.body);
    const data = { token, newPassword, confirmPassword };

    const message = await resetPassword(data);
    res.status(200).json({ message });
    return;
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
    return;
  }
};

