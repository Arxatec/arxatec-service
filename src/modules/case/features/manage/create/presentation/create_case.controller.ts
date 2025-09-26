// src/modules/cases/features/create_case/presentation/controllers/create_case.controller.ts
import { Request, Response } from "express";
import { CreateCaseService } from "./create_case.service";
import { CreateCaseSchema } from "../domain/create_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";

export class CreateCaseController {
  constructor(private readonly service = new CreateCaseService()) {}

  handle = async (req: Request, res: Response) => {
    const dto = CreateCaseSchema.parse(req.body);
    const user = await requireClientOrLawyer(req as any);

    const result = await this.service.execute(dto, user);

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
  };
}
