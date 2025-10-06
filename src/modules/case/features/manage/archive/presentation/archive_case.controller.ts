// src/modules/cases/features/manage/archive/presentation/archive_case.controller.ts
import type { Response, Request } from "express";
import { ArchiveCaseSchema } from "../domain/archive_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { archiveCaseService } from "./archive_case.service";

export async function archive(req: Request, res: Response): Promise<Response> {
  const { id } = ArchiveCaseSchema.parse({ id: String(req.params.id) });
  const user = await requireClientOrLawyer(req as any);

  const result = await archiveCaseService({ id }, user);

  return res.status(HttpStatusCodes.OK.code).json(
    buildHttpResponse(HttpStatusCodes.OK.code, "Case archived", req.path, {
      archivedCase: result,
      user,
    })
  );
}
