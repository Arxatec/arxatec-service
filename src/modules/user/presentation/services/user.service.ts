import { UserRepository } from "../../data/repository/user.repository";
import { LoginDTO } from "../../domain/dtos/login.dto";
import { RegisterDTO } from "../../domain/dtos/register.dto";
import { UpdateUserDTO } from "../../domain/dtos/udpate_user.dto";
import { User } from "../../domain/entities/user.entity";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async login(loginData: LoginDTO): Promise<User | null> {
    const user = await this.userRepository.findByEmail(loginData.email);
    // En producción, deberías comparar contraseñas hasheadas
    if (user && user.password === loginData.password) {
      return user;
    }
    return null;
  }

  async register(data: RegisterDTO): Promise<User> {
    // Recuerda hashear la contraseña antes de guardarla
    return this.userRepository.create({
      ...data,
      isActive: true,
    });
  }

  async updateAccount(id: string, data: UpdateUserDTO): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async deactivateAccount(id: string): Promise<User> {
    return this.userRepository.deactivate(id);
  }
}
