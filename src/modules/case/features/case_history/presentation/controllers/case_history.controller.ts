import { Response } from "express";
import { GetCaseHistoryService } from "../services/case_history.service";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { handleServerError } from "../../../../../../utils/error_handler";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";
import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";

export class GetCaseHistoryController {
  constructor(private readonly svc = new GetCaseHistoryService()) {}

  getHistory = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const caseId = Number(req.params.id);

      const user = await getAuthenticatedUser(req);

      const data = await this.svc.execute(caseId);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Case history retrieved",
          req.path,
          {
            history: data,
            user,
          }
        )
      );
    } catch (err) {
      return handleServerError(res, req, err);
    }
  };
}
