import { PrismaClient, user_status } from '@prisma/client';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../../domain/dtos/register.dto';
import { LoginDTO } from '../../domain/dtos/login.dto';


const prisma = new PrismaClient();

export const createUser = async (data: RegisterDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
      user_type: data.user_type, 
      status: 'active',

      lawyerData: data.user_type === 'lawyer' ? {
        create: { license_number: data.license_number || '' }
      } : undefined
    },
    include: { lawyerData: true }, 
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const updateUserStatus = async (email: string, status: user_status) => {
  await prisma.user.update({
    where: { email },
    data: { status },
  });
};

export const loginUser = async (data: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (user && await bcrypt.compare(data.password, user.password)) {
    return user;
  }
  return null;
};