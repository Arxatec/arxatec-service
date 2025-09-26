// src/modules/case/features/associations/external_clients/restore/presentation/restore.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";
import { RestoreExternalClientParamsSchema } from "../domain/restore.schema";
import { RestoreExternalClientService } from "./restore.service";

export class RestoreExternalClientController {
  constructor(private readonly service = new RestoreExternalClientService()) {}

  async restoreExternalClient(req: Request, res: Response) {
    const { id } = RestoreExternalClientParamsSchema.parse(req.params);

    const authUser = await getAuthenticatedUser(req);
    const userDetailId = String(authUser.id);

    const result = await this.service.restoreExternalClient(id, userDetailId);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "External client restored",
          req.path,
          { client: result, user: authUser }
        )
      );
  }
}
