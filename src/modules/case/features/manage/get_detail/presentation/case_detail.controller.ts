// src/modules/cases/features/manage/case_detail/presentation/case_detail.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { CaseDetailParamsSchema } from "../domain/case_detail.schema";
import { getCaseDetailService } from "./case_detail.service";

export async function getCaseDetail(req: Request, res: Response) {
  const { id } = CaseDetailParamsSchema.parse(req.params);
  const user = await requireClientOrLawyer(req as any);
  const data = await getCaseDetailService(id, user);
  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        HttpStatusCodes.OK.message,
        req.path,
        { case: data }
      )
    );
}
