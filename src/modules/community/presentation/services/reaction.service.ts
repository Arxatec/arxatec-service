import { CreateReactionDTO } from "../../domain/dtos/create_reaction.dto";
import { Reaction } from "../../domain/entities/reaction.entity";
import { ReactionRepository } from "../../data/repository/reaction.repository";

export class ReactionService {
  constructor(private repo: ReactionRepository) {}

  async react(userId: number, data: CreateReactionDTO): Promise<Reaction> {
    return this.repo.createOrUpdate(userId, data);
  }

  async remove(userId: number, target_id: number, target_type: string): Promise<void> {
    return this.repo.delete(userId, target_id, target_type);
  }

  async getByTarget(target_id: number, target_type: string): Promise<Reaction[]> {
    return this.repo.findAllByTarget(target_id, target_type);
  }
}
