import { Response } from "express";
import { ZodError } from "zod";
import { UpdateCaseService } from "../services/update_case.service";
import {
  UpdateCaseSchema,
  UpdateCaseParamsSchema,
} from "../../domain/dtos/update_case.schema";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";

export class UpdateCaseController {
  constructor(private readonly service = new UpdateCaseService()) {}

  patch = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = UpdateCaseParamsSchema.parse(req.params);
      const dto = UpdateCaseSchema.parse(req.body);

      const [data, user] = await Promise.all([
        this.service.execute(id, dto, req.user!),
        getAuthenticatedUser(req),
      ]);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          HttpStatusCodes.OK.message,
          req.path,
          {
            case: data,
            user,
          },
        )
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const z = handleZodError(err, req);
        return res.status(z.status).json(z);
      }
      return handleServerError(res, req, err);
    }
  };
}
