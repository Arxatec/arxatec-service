// src/modules/cases/features/manage/update_case/presentation/update_case.controller.ts
import { Request, Response } from "express";
import { UpdateCaseService } from "./update_case.service";
import {
  UpdateCaseSchema,
  UpdateCaseParamsSchema,
} from "../domain/update_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";

export class UpdateCaseController {
  constructor(private readonly service = new UpdateCaseService()) {}

  patch = async (req: Request, res: Response) => {
    const { id } = UpdateCaseParamsSchema.parse(req.params);
    const dto = UpdateCaseSchema.parse(req.body);
    const user = await requireClientOrLawyer(req as any);

    const data = await this.service.execute(id, dto, user);

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
  };
}
