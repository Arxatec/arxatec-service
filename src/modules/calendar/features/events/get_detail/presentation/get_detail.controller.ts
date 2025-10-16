// src/modules/calendar/features/events/get_detail/presentation/get_detail.controller.ts
import { Request, Response } from "express";
import { GetCalendarEventDetailSchema } from "../domain/get_detail.schema";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../../../constants/http_status_codes";
import { getCalendarEventDetailService } from "./get_detail.service";
import { requireClientOrLawyer } from "../../../../../../utils/authenticated_user";

export async function detail(req: Request, res: Response) {
  const { id } = GetCalendarEventDetailSchema.parse(req.params);
  const user = await requireClientOrLawyer(req as any);
  const result = await getCalendarEventDetailService(id, user);
  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Detalle obtenido correctamente",
        req.path,
        result
      )
    );
}
