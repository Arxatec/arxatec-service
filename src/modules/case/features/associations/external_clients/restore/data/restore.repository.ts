// src/modules/case/features/associations/external_clients/restore/data/restore.repository.ts
import prisma from "../../../../../../../config/prisma_client";
import { external_clients } from "@prisma/client";

export class RestoreExternalClientRepository {
  findByIdAndLawyer(
    id: string,
    userDetailId: string
  ): Promise<external_clients | null> {
    return prisma.external_clients.findFirst({
      where: { id, user_detail_id: userDetailId },
    });
  }

  restore(id: string): Promise<external_clients> {
    return prisma.external_clients.update({
      where: { id },
      data: { archived: false },
    });
  }
}
