// src/modules/calendar/features/events/create_event/presentation/create_event.controller.ts
import { Request, Response } from "express";
import { CreateCalendarEventSchema } from "../domain/create_event.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { createCalendarEventService } from "./create_event.service";
import { requireLawyer } from "../../../../../../utils/authenticated_user";

export async function create(req: Request, res: Response) {
  const dto = CreateCalendarEventSchema.parse(req.body);
  const user = await requireLawyer(req as any);
  const result = await createCalendarEventService(dto, user);

  return res
    .status(HttpStatusCodes.CREATED.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.CREATED.code,
        result.message,
        req.path,
        { id: result.id }
      )
    );
}
