// src/modules/cases/features/manage/list_my_cases/presentation/list_my_cases.controller.ts
import { Request, Response } from "express";
import { ListMyCasesService } from "./list_my_cases.service";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { ListMyCasesQuerySchema } from "../domain/list_my_cases.schema";

export class ListMyCasesController {
  constructor(private readonly service = new ListMyCasesService()) {}

  handle = async (req: Request, res: Response) => {
    const query = ListMyCasesQuerySchema.parse(req.query);
    const user = await requireClientOrLawyer(req as any);

    const result = await this.service.execute(user, query);

    return res.status(HttpStatusCodes.OK.code).json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        HttpStatusCodes.OK.message,
        req.path,
        {
          cases: result.items,
          meta: result.meta,
          user,
        }
      )
    );
  };
}
