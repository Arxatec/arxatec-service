import { PrismaClient, Prisma, ExternalClients } from "@prisma/client";

export class ExternalClientsRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  create(data: Prisma.ExternalClientsCreateInput): Promise<ExternalClients> {
    return this.prisma.externalClients.create({ data });
  }

  findManyByLawyer(
    userDetailId: number,
    includeArchived = false,
  ): Promise<ExternalClients[]> {
    return this.prisma.externalClients.findMany({
      where: {
        user_detail_id: userDetailId,
        archived: includeArchived,
      },
      orderBy: { created_at: "desc" },
    });
  }

  findByIdAndLawyer(
    id: number,
    userDetailId: number,
    includeArchived = false,
  ): Promise<ExternalClients | null> {
    return this.prisma.externalClients.findFirst({
      where: { id, user_detail_id: userDetailId, archived: includeArchived },
    });
  }

  update(
    id: number,
    data: Prisma.ExternalClientsUpdateInput,
  ): Promise<ExternalClients> {
    return this.prisma.externalClients.update({ where: { id }, data });
  }

  archive(id: number): Promise<ExternalClients> {
    return this.prisma.externalClients.update({
      where: { id },
      data: { archived: true },
    });
  }

  restore(id: number): Promise<ExternalClients> {
    return this.prisma.externalClients.update({
      where: { id },
      data: { archived: false },
    });
  }
}
