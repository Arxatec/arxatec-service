// src/modules/cases/features/associations/attachments/list/presentation/list.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";
import { ListAttachmentService } from "./list.service";
import {
  ListAttachmentsParamsSchema,
  ListAttachmentsQuerySchema,
} from "../domain/list.schema";

export class ListAttachmentController {
  constructor(private readonly svc = new ListAttachmentService()) {}

  list = async (req: Request, res: Response) => {
    const { id } = ListAttachmentsParamsSchema.parse(req.params);
    const query = ListAttachmentsQuerySchema.parse(req.query);
    const user = await getAuthenticatedUser(req as any);
    const result = await this.svc.list(
      id,
      { id: String(user.id), role: user.user_type as "client" | "lawyer" },
      query
    );

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Attachments listed",
          req.path,
          { attachments: result.items, meta: result.meta, user }
        )
      );
  };
}
