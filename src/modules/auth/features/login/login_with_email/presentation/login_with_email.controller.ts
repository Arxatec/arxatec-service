import { Request, Response } from "express";
import { HttpStatusCodes } from "../../../../../../constants";
import { buildHttpResponse } from "../../../../../../utils";
import { loginWithEmail } from "./login_with_email.service";
import { LoginSchema } from "../domain/login_with_email.schema";

export async function login(req: Request, res: Response): Promise<Response> {
  const data = LoginSchema.parse(req.body);
  const result = await loginWithEmail(data);

  return res
    .status(HttpStatusCodes.OK.code)
    .json(
      buildHttpResponse(
        HttpStatusCodes.OK.code,
        "Ingreso exitoso",
        req.path,
        result
      )
    );
}
