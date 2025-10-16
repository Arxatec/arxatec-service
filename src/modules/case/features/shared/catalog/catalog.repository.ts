// src/modules/cases/feature/shared/catalog/catalog.repository.ts
import { case_status, case_category } from "@prisma/client";

export function getAllStatuses() {
  return Object.values(case_status).map((status) => ({
    value: status,
    label: getStatusLabel(status),
  }));
}
export function getAllCategories() {
  return Object.values(case_category).map((category) => ({
    value: category,
    label: getCategoryLabel(category),
  }));
}

function getStatusLabel(status: case_status): string {
  const labels: Record<case_status, string> = {
    [case_status.open]: "open",
    [case_status.in_progress]: "En Progreso",
    [case_status.closed]: "closed",
    [case_status.archived]: "archived",
  };
  return labels[status];
}

function getCategoryLabel(category: case_category): string {
  const labels: Record<case_category, string> = {
    [case_category.civil]: "Civil",
    [case_category.laboral]: "Laboral",
    [case_category.familiar]: "Familiar",
    [case_category.penal]: "Penal",
  };
  return labels[category];
}

export function getOpenAndTakenStatusIds() {
  return {
    openStatusId: case_status.open,
    takenStatusId: case_status.in_progress,
  };
}

export function getClosedStatusId() {
  return case_status.closed;
}

export function getArchivedStatusId() {
  return case_status.archived;
}
