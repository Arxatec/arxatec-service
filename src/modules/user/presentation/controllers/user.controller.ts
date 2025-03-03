import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserRepository } from "../../data/repository/user.repository";
import { LoginDTO } from "../../domain/dtos/login.dto";
import { RegisterDTO } from "../../domain/dtos/register.dto";
import { UpdateUserDTO } from "../../domain/dtos/udpate_user.dto";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  async login(req: Request, res: Response): Promise<Response> {
    const loginData = req.body as LoginDTO;
    const user = await userService.login(loginData);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  async register(req: Request, res: Response): Promise<Response> {
    const registerData = req.body as RegisterDTO;
    const user = await userService.register(registerData);
    return res.status(201).json(user);
  }

  async updateAccount(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateData = req.body as UpdateUserDTO;
    const user = await userService.updateAccount(id, updateData);
    return res.status(200).json(user);
  }

  async deactivateAccount(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await userService.deactivateAccount(id);
    return res.status(200).json(user);
  }
}
