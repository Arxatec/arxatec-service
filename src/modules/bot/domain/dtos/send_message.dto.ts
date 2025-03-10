import { z } from "zod";
import { SendMessageSchema } from "../schema/send_message.schema";

export type SendMessageDTO = z.infer<typeof SendMessageSchema>;
