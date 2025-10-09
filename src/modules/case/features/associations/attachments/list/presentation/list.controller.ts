// src/modules/cases/features/associations/attachments/list/presentation/list.controller.ts
import type { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import {
  ListAttachmentsParamsSchema,
  ListAttachmentsQuerySchema,
} from "../domain/list.schema";
import { requireClientOrLawyer } from "../../../../../../../utils/authenticated_user";
import { listCaseAttachments } from "./list.service";

export async function list(req: Request, res: Response): Promise<Response> {
  const { id } = ListAttachmentsParamsSchema.parse(req.params);
  const query = ListAttachmentsQuerySchema.parse(req.query);
  const user = await requireClientOrLawyer(req as any);

  const result = await listCaseAttachments(id, user, query);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Attachments listed",
        req.path,
        { attachments: result.attachments, pagination: result.pagination }
      )
    );
}
