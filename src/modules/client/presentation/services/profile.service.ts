import { UpdateClientDTO } from "../../domain/dtos/profile.dto";
import { updateClientProfile } from "../../data/repository/profile.repository";

export const updateClient = async (id: number, data: UpdateClientDTO) => {
  return await updateClientProfile(id, data);
};
