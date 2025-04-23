import { PrismaClient } from "@prisma/client";
import { CreateReactionDTO } from "../../domain/dtos/create_reaction.dto";
import { Reaction } from "../../domain/entities/reaction.entity";

export class ReactionRepository {
  private prisma = new PrismaClient();

  async createOrUpdate(userId: number, data: CreateReactionDTO): Promise<Reaction> {
    const communityUser = await this.prisma.communityUsers.findFirst({ where: { user_id: userId } });
    if (!communityUser) throw new Error("No pertenece a ninguna comunidad");

    const exists = await this.validateTargetExists(data.target_id, data.target_type);
    if (!exists) throw new Error("El ID de destino no existe para el tipo especificado");

    const existing = await this.prisma.reactions.findUnique({
      where: {
        community_user_id_target_id_target_type: {
          community_user_id: communityUser.id,
          target_id: data.target_id,
          target_type: data.target_type
        }
      }
    });

    const reaction = existing
      ? await this.prisma.reactions.update({
          where: {
            community_user_id_target_id_target_type: {
              community_user_id: communityUser.id,
              target_id: data.target_id,
              target_type: data.target_type
            }
          },
          data: { type: data.type }
        })
      : await this.prisma.reactions.create({
          data: {
            community_user_id: communityUser.id,
            target_id: data.target_id,
            target_type: data.target_type,
            type: data.type
          }
        });

    return {
      id: reaction.id,
      target_id: reaction.target_id,
      target_type: reaction.target_type,
      type: reaction.type,
      user_id: communityUser.user_id,
      created_at: reaction.created_at
    };
  }

  async delete(userId: number, target_id: number, target_type: string): Promise<void> {
    const communityUser = await this.prisma.communityUsers.findFirst({ where: { user_id: userId } });
    if (!communityUser) throw new Error("No pertenece a ninguna comunidad");

    await this.prisma.reactions.delete({
      where: {
        community_user_id_target_id_target_type: {
          community_user_id: communityUser.id,
          target_id,
          target_type: target_type as any
        }
      }
    });
  }

  async findAllByTarget(target_id: number, target_type: string): Promise<Reaction[]> {
    const results = await this.prisma.reactions.findMany({
      where: {
        target_id,
        target_type: target_type as any
      }
    });

    return results.map((r) => ({
      id: r.id,
      target_id: r.target_id,
      target_type: r.target_type,
      type: r.type,
      user_id: r.community_user_id,
      created_at: r.created_at
    }));
  }

  private async validateTargetExists(id: number, type: string): Promise<boolean> {
    if (type === "publication") {
      return !!(await this.prisma.publications.findUnique({ where: { id } }));
    } else if (type === "comment") {
      return !!(await this.prisma.comments.findUnique({ where: { id } }));
    } else if (type === "reply") {
      return !!(await this.prisma.commentReplies.findUnique({ where: { id } }));
    }
    return false;
  }
}
