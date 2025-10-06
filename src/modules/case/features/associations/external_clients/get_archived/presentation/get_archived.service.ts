// src/modules/case/features/associations/external_clients/get_archived/presentation/get_archived.service.ts
import { findArchivedByLawyer } from "../data/get_archived.repository";

export function getArchivedExternalClientsService(userDetailId: string) {
  return findArchivedByLawyer(userDetailId);
}
