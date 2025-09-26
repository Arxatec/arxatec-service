// modules/cases/feature/shared/catalog/catalog.repository.ts
import prisma from "../../../../../config/prisma_client";
import { MESSAGES } from "../../../../../constants/messages/";

const OPEN_ALIASES = ["open", "abierto", "registrado", "apertura", "open_case"];
const TAKEN_ALIASES = [
  "taken",
  "asignado",
  "tomado",
  "en proceso",
  "in_progress",
];
const CLOSED_ALIASES = ["closed", "cerrado", "archivado", "finalizado"];

function norm(s?: string | null) {
  return (s ?? "").trim().toLowerCase();
}

export class CatalogRepository {
  getAllStatuses() {
    return prisma.case_statuses.findMany({ orderBy: { name: "asc" } });
  }

  getAllCategories() {
    return prisma.case_categories.findMany({ orderBy: { name: "asc" } });
  }

  getStatusById(id: string) {
    return prisma.case_statuses.findUnique({ where: { id } });
  }

  getCategoryById(id: string) {
    return prisma.case_categories.findUnique({ where: { id } });
  }

  async getOpenAndTakenStatusIds() {
    const statuses = await prisma.case_statuses.findMany({
      select: { id: true, name: true },
    });

    const findByAliases = (aliases: string[]) =>
      statuses.find((s) => aliases.includes(norm(s.name)));

    const open = findByAliases(OPEN_ALIASES);
    const taken = findByAliases(TAKEN_ALIASES);

    if (!open || !taken) {
      throw new Error(MESSAGES.CASE.NEED_MIN_2_STATUSES);
    }
    return { openStatusId: open.id, takenStatusId: taken.id };
  }

  async getClosedStatusId() {
    const statuses = await prisma.case_statuses.findMany({
      select: { id: true, name: true },
    });
    const closed = statuses.find((s) => CLOSED_ALIASES.includes(norm(s.name)));
    if (!closed) throw new Error("CLOSED_STATUS_NOT_FOUND");
    return closed.id;
  }
}
