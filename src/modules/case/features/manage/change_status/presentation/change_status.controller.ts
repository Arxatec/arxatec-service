// src/modules/cases/features/manage/change_status/presentation/change_status.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import {
  ChangeStatusParamsSchema,
  ChangeStatusSchema,
} from "../domain/change_status.schema";
import { changeStatusService } from "./change_status.service";

export async function patch(req: Request, res: Response) {
  const { id } = ChangeStatusParamsSchema.parse({ id: String(req.params.id) });
  const dto = ChangeStatusSchema.parse(req.body);
  const user = await requireClientOrLawyer(req as any);

  const result = await changeStatusService(id, dto, user);

  return res.status(HttpStatusCodes.OK.code).json(
    buildHttpResponse(
      HttpStatusCodes.OK.code,
      HttpStatusCodes.OK.message,
      req.path,
      {
        case: result,
        user,
      }
    )
  );
}
