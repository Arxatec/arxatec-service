// src/modules/cases/features/manage/change_status/presentation/change_status.controller.ts
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";
import { ChangeStatusService } from "./change_status.service";
import {
  ChangeStatusParamsSchema,
  ChangeStatusSchema,
} from "../domain/change_status.schema";

export class ChangeStatusController {
  constructor(private svc = new ChangeStatusService()) {}

  patch = async (req: Request, res: Response) => {
    const { id } = ChangeStatusParamsSchema.parse({
      id: String(req.params.id),
    });
    const dto = ChangeStatusSchema.parse(req.body);
    const user = await requireClientOrLawyer(req as any);

    const result = await this.svc.execute(id, dto, user);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          { case: result, user }
        )
      );
  };
}
