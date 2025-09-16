// src/modules/case/features/explore_cases/presentation/explore_cases.controller.ts
import { Response } from "express";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { ExploreCasesService } from "./explore_cases.service";
import { ExploreCasesQuerySchema } from "../domain/explore_cases.schema";
import { AuthenticatedRequest } from "../../../../../middlewares/authenticate_token";

export class ExploreCasesController {
  constructor(private svc = new ExploreCasesService()) {}

  explore = async (req: AuthenticatedRequest, res: Response) => {
    const { category_id, status_id, lawyer_id, page, limit } =
      ExploreCasesQuerySchema.parse(req.query);

    const filters = {
      is_public: true,
      ...(category_id && { category_id }),
      ...(status_id && { status_id }),
      ...(lawyer_id !== undefined && { lawyerId: lawyer_id }),
      archived: false,
    };

    const result = await this.svc.explore(filters, { page, limit });
    const user = req.user ? await getAuthenticatedUser(req) : undefined;

    return res.status(HttpStatusCodes.OK.code).json(
      buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, {
        cases: result.items,
        meta: result.meta,
        ...(user && { user }),
      })
    );
  };

  categories = async (req: AuthenticatedRequest, res: Response) => {
    const [data, user] = await Promise.all([
      this.svc.getCategories(),
      req.user ? getAuthenticatedUser(req) : Promise.resolve(undefined),
    ]);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, {
          categories: data,
          ...(user && { user }),
        })
      );
  };

  statuses = async (req: AuthenticatedRequest, res: Response) => {
    const [data, user] = await Promise.all([
      this.svc.getStatuses(),
      req.user ? getAuthenticatedUser(req) : Promise.resolve(undefined),
    ]);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, {
          statuses: data,
          ...(user && { user }),
        })
      );
  };
}
