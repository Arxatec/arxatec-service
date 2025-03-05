import { Request, Response } from "express";
import { SubscribeSchema } from "../../domain/dtos/sub_information.dto";
import { subscribeToUpdates } from "../services/sub_information.service";

export const subscribeController = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = SubscribeSchema.parse(req.body);
    const message = await subscribeToUpdates(data);
    res.status(201).json({ message });
    return;
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error desconocido" });
    return;
  }
};
