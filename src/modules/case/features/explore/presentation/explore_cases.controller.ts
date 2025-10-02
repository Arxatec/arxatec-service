// src/modules/case/features/explore_cases/presentation/explore_cases.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { ExploreCasesService } from "./explore_cases.service";
import { ExploreCasesQuerySchema } from "../domain/explore_cases.schema";

export class ExploreCasesController {
  constructor(private svc = new ExploreCasesService()) {}

  explore = async (req: Request, res: Response) => {
    const { category, status, lawyer_id, search, page, limit } =
      ExploreCasesQuerySchema.parse(req.query);

    const filters = {
      is_public: true,
      ...(category && { category }),
      ...(status && { status }),
      ...(lawyer_id !== undefined && { lawyerId: lawyer_id }),
      ...(search && { search }),
      archived: false,
    };

    const result = await this.svc.explore(filters, { page, limit });
    const user = req.user ? await getAuthenticatedUser(req) : undefined;

    return res.status(HttpStatusCodes.OK.code).json(
      buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, {
        cases: result.items,
        pagination: result.meta,
        ...(user && { user }),
      })
    );
  };
}
