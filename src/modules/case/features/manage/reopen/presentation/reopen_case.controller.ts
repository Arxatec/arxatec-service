// src/modules/cases/features/manage/reopen_case/presentation/reopen_case.controller.ts
import { Request, Response } from "express";
import { ReopenCaseService } from "./reopen_case.service";
import { ReopenCaseParamsSchema } from "../domain/reopen_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";

export class ReopenCaseController {
  constructor(private readonly svc = new ReopenCaseService()) {}

  reopen = async (req: Request, res: Response) => {
    const { id } = ReopenCaseParamsSchema.parse(req.params);
    const user = await requireClientOrLawyer(req as any);

    const data = await this.svc.execute({ id }, user);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Case reopened",
          req.path,
          { case: data, user }
        )
      );
  };
}
