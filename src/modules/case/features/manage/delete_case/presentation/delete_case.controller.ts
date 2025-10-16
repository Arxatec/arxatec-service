// src/modules/cases/features/manage/delete_case/presentation/delete_case.controller.ts
import { Request, Response } from "express";
import { DeleteCaseParamsSchema } from "../domain/delete_case.schema";
import { deleteCaseService } from "./delete_case.service";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";

export async function remove(req: Request, res: Response): Promise<Response> {
  const { case_id } = DeleteCaseParamsSchema.parse(req.params);
  const user = await requireClientOrLawyer(req as any); 
  const result = await deleteCaseService({ case_id }, user as any);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        result.message,
        req.path,
        result
      )
    );
}
