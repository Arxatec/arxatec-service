import { user_type } from "@prisma/client";
import { z } from "zod";

export const GetProfileResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
  userType: z.nativeEnum(user_type).nullable(),
  createdAt: z.date().nullable(),
});

export type GetProfileResponseDTO = z.infer<typeof GetProfileResponseSchema>;
