// src/modules/auth/features/password_reset/confirm_password_reset/data/confirm_password_reset.repository.ts
import prisma from "../../../../../../config/prisma_client";

export interface ConfirmPasswordResetRepository {
  updatePassword(email: string, password: string): Promise<boolean>;
}

export class ConfirmPasswordResetRepositoryImpl
  implements ConfirmPasswordResetRepository
{
  async updatePassword(email: string, password: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await prisma.users.updateMany({
      where: { email: normalizedEmail },
      data: { password },
    });
    return result.count > 0;
  }
}
