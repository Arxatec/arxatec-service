import { Request, Response } from "express";
import { FormService } from "../services/form.service";
import { SupportFormSchema } from "../../domain/schema/form.schema";
import { SupportFormDTO } from "../../domain/dtos/form.dtos";
import { handleServerError, handleZodError } from "../../../../utils/error_handler";
import { HttpStatusCodes, MESSAGES } from "../../../../constants";
import { buildHttpResponse } from "../../../../utils";
import { ZodError } from "zod";

const formService = new FormService();
export class FormController {
  async submitForm(req: Request, res: Response) {
    try {
      const formData = SupportFormSchema.parse(req.body) as SupportFormDTO;
      const response = await formService.submitSupportForm(formData);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.FORM.SUPPORT_SUCCESS,
          req.path,
          response
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const createdError = handleZodError(error, req);
        return res.status(createdError.status).json(createdError);
      }
      return handleServerError(res, req, error);
    }
  }
}
