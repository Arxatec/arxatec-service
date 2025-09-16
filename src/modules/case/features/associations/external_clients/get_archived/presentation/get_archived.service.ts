// src/modules/case/features/associations/external_clients/get_archived/presentation/get_archived.service.ts
import { getArchivedExternalClientsRepository as repo } from "../data/get_archived.repository";

export const getArchivedExternalClientsService = (userDetailId: string) => {
  return repo.findManyByLawyer(userDetailId);
};
