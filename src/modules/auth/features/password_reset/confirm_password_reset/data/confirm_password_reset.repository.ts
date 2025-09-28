import prisma from "../../../../../../config/prisma_client";

export async function updatePassword(
  email: string,
  password: string
): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await prisma.users.updateMany({
    where: { email: normalizedEmail },
    data: { password },
  });
  return result.count > 0;
}
