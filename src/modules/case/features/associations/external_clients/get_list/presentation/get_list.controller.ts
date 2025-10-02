// src/modules/case/features/associations/external_clients/get_list/presentation/get_list.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { getExternalClientsService } from "./get_list.service";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";
import { GetExternalClientsQuerySchema } from "../domain/get_list.schema";

export class GetExternalClientsController {
  async getList(req: Request, res: Response) {
    const query = GetExternalClientsQuerySchema.parse(req.query);

    const authUser = await getAuthenticatedUser(req);
    const userDetailId = String(authUser.id);

    const { clients, meta } = await getExternalClientsService(
      userDetailId,
      query
    );

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "External clients",
          req.path,
          { clients, pagination: meta, user: authUser }
        )
      );
  }
}
