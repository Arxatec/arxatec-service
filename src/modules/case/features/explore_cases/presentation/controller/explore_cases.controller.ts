import { Response } from "express";
import { z, ZodError } from "zod";

import { ExploreCasesService } from "../services/explore_cases.service";
import { HttpStatusCodes } from "../../../../../../constants";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class ExploreCasesController {
  constructor(private svc = new ExploreCasesService()) {}

  /* GET /cases/explore */
  async explore(req: AuthenticatedRequest, res: Response) {
    try {
      const QuerySchema = z.object({
        category_id: z.coerce.number().int().positive().optional(),
        status_id:   z.coerce.number().int().positive().optional(),
        lawyer_id:   z.coerce.number().int().positive().optional(),
      });

      const { category_id, status_id, lawyer_id } = QuerySchema.parse(req.query);

      const filters = {
        ...(category_id && { category_id }),
        ...(status_id && { status_id }),
        ...(lawyer_id !== undefined && { lawyerId: lawyer_id }),
      };

      const [data, user] = await Promise.all([
        this.svc.explore(filters),
        req.user ? getAuthenticatedUser(req) : Promise.resolve(undefined),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          {
            cases: data,
            ...(user && { user }),
          },
        ),
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const zErr = handleZodError(err, req);
        return res.status(zErr.status).json(zErr);
      }
      return handleServerError(res, req, err);
    }
  }

  categories = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const [data, user] = await Promise.all([
        this.svc.getCategories(),
        req.user ? getAuthenticatedUser(req) : Promise.resolve(undefined),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          {
            categories: data,
            ...(user && { user }),
          },
        ),
      );
    } catch (err) {
      return handleServerError(res, req, err);
    }
  };

  /* GET /cases/statuses */
  statuses = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const [data, user] = await Promise.all([
        this.svc.getStatuses(),
        req.user ? getAuthenticatedUser(req) : Promise.resolve(undefined),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          {
            statuses: data,
            ...(user && { user }),
          },
        ),
      );
    } catch (err) {
      return handleServerError(res, req, err);
    }
  };
}
