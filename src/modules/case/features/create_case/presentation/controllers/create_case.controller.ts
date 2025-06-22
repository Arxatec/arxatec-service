import { Response } from "express";
import { CreateCaseService } from "../services/create_case.service";
import { CreateCaseSchema } from "../../domain/dtos/create_case.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { CaseEntity } from "../../domain/entities/case.entity";
import { ZodError } from "zod";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class CreateCaseController {
  constructor(private readonly service = new CreateCaseService()) {}

  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const dto = CreateCaseSchema.parse(req.body);

      const [result, user] = await Promise.all([
        this.service.execute(dto, req.user!),
        getAuthenticatedUser(req),
      ]);

      const response: CaseEntity = {
        id: result.case_id,
        service_id: 0,
        title: dto.title,
        description: dto.description,
        category_id: dto.category_id,
        status_id: dto.status_id ?? 0,
        urgency: dto.urgency ?? "media",
        is_public: dto.is_public ?? true,
        reference_code: dto.reference_code,
      };

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          result.message,
          req.path,
          {
            case: response,
            user,
          }
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }
}
