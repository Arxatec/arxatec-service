import { Request, Response } from "express";
import { verifyToken } from "../../../../shared/config/jwt";
import { updateUserStatus, findUserByEmail } from "../../data/repository/user.repository";

export const verifyEmailController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).json({ message: "Token faltante" });
      return;
    }

    // Verificar token
    const decoded = verifyToken(token as string);
    if (!decoded) {
      res.status(400).json({ message: "Token inválido o expirado" });
      return;
    }

    // Obtener usuario
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // Actualizar estado del usuario en la base de datos
    await updateUserStatus(decoded.email, "active");

    res.status(200).json({ message: `Cuenta verificada con éxito. Bienvenido, ${user.first_name}!` });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar la cuenta" });
  }
};
