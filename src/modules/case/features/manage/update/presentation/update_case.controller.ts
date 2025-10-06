// src/modules/cases/features/manage/update_case/presentation/update_case.controller.ts
import { Request, Response } from "express";
import {
  UpdateCaseSchema,
  UpdateCaseParamsSchema,
} from "../domain/update_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { updateCaseService } from "./update_case.service";

export async function patch(req: Request, res: Response) {
  const { id } = UpdateCaseParamsSchema.parse(req.params);
  const dto = UpdateCaseSchema.parse(req.body);
  const user = await requireClientOrLawyer(req as any);
  const data = await updateCaseService(id, dto, user);
  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        HttpStatusCodes.OK.message,
        req.path,
        { case: data, user }
      )
    );
}
