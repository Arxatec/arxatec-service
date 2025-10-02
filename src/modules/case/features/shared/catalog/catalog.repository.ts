// modules/cases/feature/shared/catalog/catalog.repository.ts
import { case_status, case_category } from "@prisma/client";

export class CatalogRepository {
  // Devuelve todos los estados disponibles del enum
  getAllStatuses() {
    return Object.values(case_status).map((status) => ({
      value: status,
      label: this.getStatusLabel(status),
    }));
  }

  // Devuelve todas las categorías disponibles del enum
  getAllCategories() {
    return Object.values(case_category).map((category) => ({
      value: category,
      label: this.getCategoryLabel(category),
    }));
  }

  // Convierte el enum a un label legible
  private getStatusLabel(status: case_status): string {
    const labels: Record<case_status, string> = {
      [case_status.abierto]: "Abierto",
      [case_status.en_progreso]: "En Progreso",
      [case_status.cerrado]: "Cerrado",
      [case_status.archivado]: "Archivado",
    };
    return labels[status];
  }

  // Convierte el enum a un label legible
  private getCategoryLabel(category: case_category): string {
    const labels: Record<case_category, string> = {
      [case_category.civil]: "Civil",
      [case_category.laboral]: "Laboral",
      [case_category.familiar]: "Familiar",
      [case_category.penal]: "Penal",
    };
    return labels[category];
  }

  // Devuelve los estados para casos abiertos y tomados
  getOpenAndTakenStatusIds() {
    return {
      openStatusId: case_status.abierto,
      takenStatusId: case_status.en_progreso,
    };
  }

  // Devuelve el estado para casos cerrados
  getClosedStatusId() {
    return case_status.cerrado;
  }

  // Devuelve el estado para casos archivados
  getArchivedStatusId() {
    return case_status.archivado;
  }
}
