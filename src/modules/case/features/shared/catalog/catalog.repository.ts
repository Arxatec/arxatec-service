// src/modules/cases/feature/shared/catalog/catalog.repository.ts
import { case_status, case_category } from "@prisma/client";

//Devuelve todos los estados del enum con su etiqueta legible.
export function getAllStatuses() {
  return Object.values(case_status).map((status) => ({
    value: status,
    label: getStatusLabel(status),
  }));
}

//Devuelve todas las categorías del enum con su etiqueta legible.
export function getAllCategories() {
  return Object.values(case_category).map((category) => ({
    value: category,
    label: getCategoryLabel(category),
  }));
}

//Traduce un estado del enum a un label descriptivo.
function getStatusLabel(status: case_status): string {
  const labels: Record<case_status, string> = {
    [case_status.abierto]: "Abierto",
    [case_status.en_progreso]: "En Progreso",
    [case_status.cerrado]: "Cerrado",
    [case_status.archivado]: "Archivado",
  };
  return labels[status];
}

//Traduce una categoría del enum a un label descriptivo.

function getCategoryLabel(category: case_category): string {
  const labels: Record<case_category, string> = {
    [case_category.civil]: "Civil",
    [case_category.laboral]: "Laboral",
    [case_category.familiar]: "Familiar",
    [case_category.penal]: "Penal",
  };
  return labels[category];
}

//Devuelve los IDs de estado para casos abiertos y en progreso.
export function getOpenAndTakenStatusIds() {
  return {
    openStatusId: case_status.abierto,
    takenStatusId: case_status.en_progreso,
  };
}

//Devuelve el ID de estado para casos cerrados.
export function getClosedStatusId() {
  return case_status.cerrado;
}

//Devuelve el ID de estado para casos archivados.
export function getArchivedStatusId() {
  return case_status.archivado;
}
