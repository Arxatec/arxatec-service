import { PrismaClient, user_status} from "@prisma/client";
import bcrypt from "bcrypt";
import { RegisterDTO } from "../../domain/dtos/register.dto";
import { OnboardingDTO } from "../../domain/dtos/onboarding.dto";
import { User } from "../../domain/entities/user.entity";

const prisma = new PrismaClient();

export class AuthRepository {
  // Crea un nuevo usuario con estado "pending"
  async createUser(data: RegisterDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword,
        status: user_status.pending,
      },
    });

    return new User(
      userData.id,
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.password,
      userData.status,
      userData.creation_timestamp,
      userData.user_type
    );
  }

  // ✅ Obtiene un usuario por su correo electrónico
  async getEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        status: true,
        creation_timestamp: true,
        user_type: true, // Incluimos el tipo de usuario
      },
    });

    return userData
      ? new User(
          userData.id,
          userData.first_name,
          userData.last_name,
          userData.email,
          userData.password,
          userData.status,
          userData.creation_timestamp,
          userData.user_type
        )
      : null;
  }

  // ✅ Obtiene un usuario por su ID (útil para onboarding)
  async getUserById(userId: number): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        status: true,
        creation_timestamp: true,
        user_type: true, 
      },
    });

    return userData
      ? new User(
          userData.id,
          userData.first_name,
          userData.last_name,
          userData.email,
          userData.password,
          userData.status,
          userData.creation_timestamp,
          userData.user_type
        )
      : null;
  }

  // Actualiza el estado del usuario (ejemplo: activar cuenta)
  async updateUserStatus(email: string, status: user_status): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: { status },
    });
  }

  // Verifica la contraseña hasheada
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Actualiza la contraseña del usuario
  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  // Actualiza la información del usuario en el Onboarding
  async updateUserOnboarding(userId: number, data: OnboardingDTO) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        user_type: data.user_type,
        profile_image: data.profile_image,
        address: data.address,
        phone: data.phone,
        additional_phone: data.additional_phone,
        gender: data.gender,
        birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
      },
    });
  }

  // Crea datos adicionales para abogados
  async createLawyerData(userId: number, license_number: string) {
    return prisma.lawyersData.create({
      data: {
        id: userId,
        license_number,
      },
    });
  }

  // Crea datos adicionales para clientes
  async createClientData(userId: number) {
    return prisma.clientsData.create({
      data: {
        id: userId,
      },
    });
  }
}
