import { z } from "zod";
import { SupportFormSchema } from "../schema/form.schema";

export type SupportFormDTO = z.infer<typeof SupportFormSchema>;
