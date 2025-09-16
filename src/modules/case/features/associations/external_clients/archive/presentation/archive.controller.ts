// src/modules/case/features/associations/external_clients/archive/presentation/archive.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { archiveExternalClientService } from "./archive.service";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";
import { ArchiveExternalClientParamSchema } from "../domain/archive.schema";

export class ArchiveExternalClientController {
  async archive(req: Request, res: Response) {
    const { id } = ArchiveExternalClientParamSchema.parse(req.params);

    const authUser = await getAuthenticatedUser(req);
    const userDetailId = String(authUser.id);

    const result = await archiveExternalClientService(id, userDetailId);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "External client archived",
          req.path,
          { client: result, user: authUser }
        )
      );
  }
}
