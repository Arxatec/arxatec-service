import { Request, Response } from "express";
import { CreateReactionSchema } from "../../domain/dtos/create_reaction.dto";
import { ReactionService } from "../services/reaction.service";
import { ReactionRepository } from "../../data/repository/reaction.repository";

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

const service = new ReactionService(new ReactionRepository());

export class ReactionController {
  async react(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = CreateReactionSchema.parse(req.body);
      const result = await service.react(authReq.user.id, data);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : "Error" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      const { target_type, target_id } = req.params;
      await service.remove(authReq.user.id, Number(target_id), String(target_type));
      return res.status(204).send();
    } catch (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : "Error" });
    }
  }

  async getByTarget(req: Request, res: Response) {
    try {
      const { target_type, target_id } = req.params;
      const result = await service.getByTarget(Number(target_id), String(target_type));
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : "Error" });
    }
  }
}
