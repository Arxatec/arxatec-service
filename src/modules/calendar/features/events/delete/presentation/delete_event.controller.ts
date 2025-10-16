//src/modules/calendar/features/events/delete/presentation/delete_event.controller.ts
import { Request, Response } from "express";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { deleteCalendarEventService } from "./delete_event.service";
import { requireLawyer } from "../../../../../../utils/authenticated_user";

export async function remove(req: Request, res: Response) {
  const user = await requireLawyer(req as any);
  const { id } = req.params;
  const result = await deleteCalendarEventService(id, user);
  return res.status(HttpStatusCodes.OK.code).json(
    buildHttpResponse(HttpStatusCodes.OK.code, result.message, req.path, {
      id: result.id,
    })
  );
}
