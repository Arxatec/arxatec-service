// src/modules/case/features/associations/external_clients/get_detail/presentation/get_detail.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../../constants/http_status_codes";
import { getExternalClientDetailService } from "./get_detail.service";
import { ExternalClientIdParamSchema } from "../domain/get_detail.schema";
import { getAuthenticatedUser } from "../../../../../../../utils/authenticated_user";

export class GetExternalClientDetailController {
  async getDetail(req: Request, res: Response) {
    const { id } = ExternalClientIdParamSchema.parse(req.params);

    const authUser = await getAuthenticatedUser(req);
    const userDetailId = String(authUser.id);

    const client = await getExternalClientDetailService(id, userDetailId);

    return res.status(HttpStatusCodes.OK.code).json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "External client detail",
        req.path,
        {
          id: client.id,
          profile_image: client.profile_image,
          full_name: client.full_name,
          email: client.email,
          phone: client.phone,
          dni: client.dni,
          created_at: client.created_at,
          archived: client.archived,
        }
      )
    );
  }
}
