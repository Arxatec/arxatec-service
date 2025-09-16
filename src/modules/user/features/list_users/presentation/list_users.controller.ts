// src/modules/user/features/list_users/presentation/list_users.controller.ts
import { Response } from "express";
import { ListUsersService } from "./list_users.service";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../utils/authenticated_user";
import { AuthenticatedRequest } from "../../../../../middlewares/authenticate_token";

export class ListUsersController {
  constructor(private readonly service = new ListUsersService()) {}

  async handle(req: AuthenticatedRequest, res: Response) {
    await getAuthenticatedUser(req);

    const result = await this.service.execute(req.query);

    return res.status(HttpStatusCodes.OK.code).json(
      buildHttpResponse(HttpStatusCodes.OK.code, "Users list", req.path, {
        users: result.items,
        meta: result.meta,
      })
    );
  }
}
