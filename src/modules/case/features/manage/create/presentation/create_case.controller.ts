// src/modules/cases/features/manage/create_case/presentation/create_case.controller.ts
import { Request, Response } from "express";
import { CreateCaseSchema } from "../domain/create_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { createCaseService } from "./create_case.service";

export async function create(req: Request, res: Response) {
  const dto = CreateCaseSchema.parse(req.body);
  const user = await requireClientOrLawyer(req as any);
  const result = await createCaseService(dto, user);
  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.CREATED.code,
        result.message,
        req.path,
        { case: result.case, user }
      )
    );
}
