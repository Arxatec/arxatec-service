// src/modules/cases/features/manage/archive/presentation/archive_case.controller.ts
import { Response, Request } from "express";
import { ArchiveCaseService } from "./archive_case.service";
import { ArchiveCaseSchema } from "../domain/archive_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";

export class ArchiveCaseController {
  constructor(private readonly svc = new ArchiveCaseService()) {}

  archive = async (req: Request, res: Response) => {
    const { id } = ArchiveCaseSchema.parse({ id: String(req.params.id) });
    const user = await requireClientOrLawyer(req as any);

    const result = await this.svc.execute({ id }, user);

    return res.status(HttpStatusCodes.OK.code).json(
      buildHttpResponse(HttpStatusCodes.OK.code, "Case archived", req.path, {
        archivedCase: result,
        user,
      })
    );
  };
}
