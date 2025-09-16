// src/modules/user/features/edit_profile/presentation/edit_profile.service.ts
import bcrypt from "bcrypt";
import { AppError } from "../../../../../utils/errors";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { EditProfileDTO } from "../domain/edit_profile.schema";
import { EditProfileRepository } from "../data/edit_profile.repository";
import { CurrentUser } from "../../../../../utils/authenticated_user";

export class EditProfileService {
  constructor(private readonly repo = new EditProfileRepository()) {}

  async execute(dto: EditProfileDTO, user: CurrentUser) {
    if (user.role === "client") {
      const dbUser = await this.repo.getStatus(user.id);
      if (dbUser.status !== "active") {
        throw new AppError(
          "Inactive users cannot edit profile",
          HttpStatusCodes.FORBIDDEN.code
        );
      }
    }

    const root: Record<string, unknown> = {};
    const details: { gender?: string; birth_date?: Date } = {};

    if (dto.firstName) root.first_name = dto.firstName;
    if (dto.lastName) root.last_name = dto.lastName;
    if (dto.phone) root.phone = dto.phone;

    if (dto.birthDate) details.birth_date = dto.birthDate;
    if (dto.gender) details.gender = dto.gender;

    if (dto.password) {
      root.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.repo.update(user.id, root, details);

    return {
      id: updated.id,
      first_name: updated.first_name,
      last_name: updated.last_name,
      email: updated.email,
      user_type: updated.user_type,
      user_details: updated.user_details,
      admin_details: updated.admin_details,
    };
  }
}
