import { Request, Response } from "express";
import { UpdateClientSchema } from "../../domain/dtos/profile.dto";
import { updateClient } from "../services/profile.service";

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    user_type: "client" | "admin" | "lawyer";
    status: "active" | "pending" | "suspended";
  };
}
export const updateClientProfileController = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const user = authReq.user;
    if (!user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    if (user.user_type !== "client" || user.status !== "active") {
      res.status(403).json({ error: "Acceso denegado. Solo clientes activos pueden editar su perfil." });
      return;
    }

    const updateData = UpdateClientSchema.parse(req.body);
    const updatedUser = await updateClient(user.id, updateData);

    // Formateamos la fecha antes de enviar la respuesta
    const updatedUserFormatted = {
      ...updatedUser,
      birth_date: updatedUser.birth_date ? updatedUser.birth_date.toISOString().split("T")[0] : null,
    };

    res.status(200).json({ message: "Actualizado correctamente", user: updatedUserFormatted });
    return;
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error" });
    return;
  }
};
