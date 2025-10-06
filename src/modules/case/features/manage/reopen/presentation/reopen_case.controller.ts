// src/modules/cases/features/manage/reopen_case/presentation/reopen_case.controller.ts
import { Request, Response } from "express";
import { ReopenCaseParamsSchema } from "../domain/reopen_case.schema";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { reopenCaseService } from "./reopen_case.service";

export async function reopen(req: Request, res: Response) {
  const { id } = ReopenCaseParamsSchema.parse(req.params);
  const user = await requireClientOrLawyer(req as any);
  const data = await reopenCaseService(id, user);
  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(HttpStatusCodes.OK.code, "Case reopened", req.path, {
        case: data,
        user,
      })
    );
}
