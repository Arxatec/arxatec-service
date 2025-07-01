import { Response } from "express";
import { MessageService } from "../services/message.service";
import { SendMessageSchema } from "../../domain/dtos/send_message.schema";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { ZodError } from "zod";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";

export class MessageController {
  constructor(private readonly svc = new MessageService()) {}

  send = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dto = SendMessageSchema.parse(req.body);
      const caseId = Number(req.params.id);

      const user = await getAuthenticatedUser(req);

      const newUser = {
        id: user?.id!,
        role: user?.user_type! as "client" | "lawyer",
      };

      const result = await this.svc.send(caseId, dto, newUser);

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          "Message sent successfully",
          req.path,
          {
            message: result,
            user,
          }
        )
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const zErr = handleZodError(err, req);
        return res.status(zErr.status).json(zErr);
      }
      return handleServerError(res, req, err);
    }
  };
}
