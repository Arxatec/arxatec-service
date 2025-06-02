import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserRepository } from "../../data/repository/user.repository";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { handleServerError } from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "No autorizado",
              "/users/profile",
              null
            )
          );
      }

      const profile = await userService.getProfile(authReq.user.id);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.USER.PROFILE_SUCCESS,
            "/users/profile",
            profile
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
