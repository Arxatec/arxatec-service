// src/modules/user/data/repository/user.repository.ts
import { PrismaClient, user_status } from "@prisma/client";
import bcrypt from "bcrypt";
import { RegisterDTO } from "../../domain/dtos/register.dto";
import { LoginDTO } from "../../domain/dtos/login.dto";

const prisma = new PrismaClient();


//crea el usuario
export const createUser = async (data: RegisterDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
      user_type: data.user_type,
      status: "pending",

      lawyerData:
        data.user_type === "lawyer"
          ? {
              create: { license_number: data.license_number || "" },
            }
          : undefined,
    },
    include: { lawyerData: true },
  });

  return user;
};

//busca email de usuario
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

//actualiza el estado
export const updateUserStatus = async (email: string, status: user_status) => {
  await prisma.user.update({
    where: { email },
    data: { status },
  });
};

//busca usuarios active o pending
export const getAllUsersEmails = async (): Promise<string[]> => {
  const users = await prisma.user.findMany({
    where: {
      status: {
        in: ["active", "pending"],
      },
    },
    select: {
      email: true,
    },
  });
  return users.map((user) => user.email);
};

//login
export const loginUser = async (data: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (user && (await bcrypt.compare(data.password, user.password))) {
    return user;
  }
  return null;
};

export const updateUserPassword = async (
  email: string,
  newHashedPassword: string
) => {
  return await prisma.user.update({
    where: { email },
    data: { password: newHashedPassword },
  });
};
