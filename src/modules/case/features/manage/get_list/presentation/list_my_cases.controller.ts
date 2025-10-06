// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.controller.ts
import type { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { ListMyCasesQuerySchema } from "../domain/list_my_cases.schema";
import { listMyCasesService } from "./list_my_cases.service";

export async function handle(req: Request, res: Response): Promise<Response> {
  const query = ListMyCasesQuerySchema.parse(req.query);
  const user = await requireClientOrLawyer(req as any);

  const result = await listMyCasesService(user, query);

  return res.status(HttpStatusCodes.OK.code).json(
    buildHttpResponse(
      HttpStatusCodes.OK.code,
      HttpStatusCodes.OK.message,
      req.path,
      {
        cases: result.items,
        pagination: result.meta,
        user,
      }
    )
  );
}
