import { Request, Response } from "express";
import { UpdateLawyerProfileSchema } from "../domain/update_profile.schema";
import { updateLawyerProfileService } from "./update_profile.service";
import { buildHttpResponse } from "../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../constants";

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const body = UpdateLawyerProfileSchema.parse(req.body);

  const result = await updateLawyerProfileService(id, body);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(buildHttpResponse(HttpStatusCodes.OK.code, "Perfil actualizado", req.path, result));
}
