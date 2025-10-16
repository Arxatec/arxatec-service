//src/modules/calendar/features/events/get_list/presentation/get_list.controller.ts
import { Request, Response } from "express";
import { GetCalendarEventsQuerySchema } from "../domain/get_list.schema";
import { listCalendarEventsService } from "./get_list.service";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";

export async function list(req: Request, res: Response) {
  const query = GetCalendarEventsQuerySchema.parse(req.query);
  const user = await requireClientOrLawyer(req as any);
  const result = await listCalendarEventsService(query, user);
  return res
    .status(HttpStatusCodes.OK.code)
    .json(buildHttpResponse(HttpStatusCodes.OK.code, "OK", req.path, result));
}
