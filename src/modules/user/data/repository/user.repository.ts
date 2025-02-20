import { PrismaClient } from '@prisma/client';
import { RegisterDTO } from '../../domain/dtos/register.dto';
import { LoginDTO } from '../../domain/dtos/login.dto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (data: RegisterDTO) => {
  const hashedPassword = await bcrypt.hash(data.password_hash, 10);

  if (data.role === 'LAWYER') {
    return await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password_hash: hashedPassword,
        role: data.role,
        lawyer_detail: {
          create: {
            national_registry: data.national_registry || "",
            specialty: data.specialty || [],
          },
        },
      },
      include: {
        lawyer_detail: true,
      },
    });
  } else {
    return await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password_hash: hashedPassword,
        role: data.role,
      },
    });
  }
};

export const loginUser = async (data: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (user && await bcrypt.compare(data.password_hash, user.password_hash)) {
    return user;
  }
  return null;
};