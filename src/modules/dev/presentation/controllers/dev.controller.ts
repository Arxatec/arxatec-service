import { Request, Response, NextFunction } from "express";
import { DevService } from "../services/dev.service";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants";

/**
 * Controlador para operaciones de desarrollo no expuestas en producción.
 * Permite ejecutar el seeding de la base de datos a través del servicio DevService.
 * El acceso está restringido mediante una variable de entorno en el enrutador principal.
 */

export class DevController {
  public static async seedDatabase(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const result = await DevService.seedDatabase();

    const response = buildHttpResponse(
      HttpStatusCodes.OK.code,
      "Comando de seed ejecutado. Revisa la salida para más detalles.",
      req.originalUrl,
      {
        stdout: result.stdout,
        stderr: result.stderr,
      }
    );

    res.status(response.status).json(response);
  }
}
