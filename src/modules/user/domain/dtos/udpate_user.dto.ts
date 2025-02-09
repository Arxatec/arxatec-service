import { z } from "zod";
import { RegisterSchema } from "./register.dto";

export const UpdateUserSchema = RegisterSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
