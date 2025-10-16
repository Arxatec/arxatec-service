//src/modules/calendar/features/events/update_hour/presentation/update_hour.controller.ts
import { Request, Response } from "express";
import { UpdateCalendarEventTimeSchema } from "../domain/update_hour.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { updateCalendarEventTimeService } from "./update_hour.service";
import { requireLawyer } from "../../../../../../utils/authenticated_user";

export async function updateTime(req: Request, res: Response) {
  const dto = UpdateCalendarEventTimeSchema.parse(req.body);
  const user = await requireLawyer(req as any);
  const { id } = req.params;
  const result = await updateCalendarEventTimeService(id, dto, user);
  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(HttpStatusCodes.OK.code, result.message, req.path, {
        id: result.id,
      })
    );
}
