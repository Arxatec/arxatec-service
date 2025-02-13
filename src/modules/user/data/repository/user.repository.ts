import { PrismaClient } from '@prisma/client';
import { RegisterDTO } from '../../domain/dtos/register.dto';
import { LoginDTO } from '../../domain/dtos/login.dto';

const prisma = new PrismaClient();
export const createUser = async (data: RegisterDTO) => {
  if (data.rol === 'ABOGADO') {
    // Crear el usuario ABROGADO
    const user = await prisma.usuario.create({
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo_electronico: data.correo_electronico,
        password: data.password,
        rol: data.rol,
        abogado_detalle: {
          create: {
            registro_nacional: data.registro_nacional || "", 
            especialidades: data.especialidades || [],
          },
        },
      },

      include: {
        abogado_detalle: true, 
      },
    });

    return user;
  } else {
    const user = await prisma.usuario.create({
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo_electronico: data.correo_electronico,
        password: data.password,
        rol: data.rol,
      },
    });

    return user;
  }
};

export const loginUser = async (data: LoginDTO) => {
  const user = await prisma.usuario.findUnique({
    where: {
      correo_electronico: data.correo_electronico
    }
  });
  if (user && user.password === data.password) {
    return user;
  }
  return null;
};
