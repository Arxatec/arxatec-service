// src/modules/cases/features/associations/attachments/list/presentation/list.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { ListAttachmentService } from "./list.service";
import {
  ListAttachmentsParamsSchema,
  ListAttachmentsQuerySchema,
} from "../domain/list.schema";
import { requireClientOrLawyer } from "../../../../../../../utils/authenticated_user";

export class ListAttachmentController {
  constructor(private readonly svc = new ListAttachmentService()) {}

  list = async (req: Request, res: Response) => {
    const { id } = ListAttachmentsParamsSchema.parse(req.params);
    const query = ListAttachmentsQuerySchema.parse(req.query);
    const user = await requireClientOrLawyer(req as any);

    const result = await this.svc.list(id, user, query);

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
