// src/modules/cases/features/manage/history/presentation/case_history.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { GetCaseHistoryService } from "./case_history.service";
import { CaseHistoryParamsSchema } from "../domain/case_history.schema";

export class GetCaseHistoryController {
  constructor(private readonly svc = new GetCaseHistoryService()) {}

  getHistory = async (req: Request, res: Response) => {
    const { id } = CaseHistoryParamsSchema.parse(req.params);
    const user = await requireClientOrLawyer(req as any);

    const data = await this.svc.execute(id, user);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Case history retrieved",
          req.path,
          { history: data, user }
        )
      );
  };
}
