// src/modules/calendar/features/events/update_all/presentation/update_all.controller.ts
import { Request, Response } from "express";
import {
  UpdateCalendarEventParamsSchema,
  UpdateCalendarEventBodySchema,
} from "../domain/update_all.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { updateCalendarEventAllService } from "./update_all.service";
import { requireLawyer } from "../../../../../../utils/authenticated_user";

export async function updateAll(req: Request, res: Response) {
  const { id } = UpdateCalendarEventParamsSchema.parse(req.params);
  const body = UpdateCalendarEventBodySchema.parse(req.body);
  const user = await requireLawyer(req as any);
  const result = await updateCalendarEventAllService(id, body, user);
  return res.status(HttpStatusCodes.OK.code).json(
    buildHttpResponse(HttpStatusCodes.OK.code, result.message, req.path, {
      id: result.id,
    })
  );
}
