import { Request, Response } from "express";
import { ClientService } from "../services/client.service";
import { ClientRepository } from "../../data/repository/client.repository";
import { UpdateClientSchema } from "../../domain/dtos/update_client.dto";
import { RegisterClientSchema } from "../../domain/dtos/register_client.dto";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import {
  handleZodError,
  handleServerError,
} from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";
import { AppError } from "../../../../utils/errors";

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);

interface AuthenticatedRequest extends Request {
  user?: { id: number; user_type: "admin" | "client" | "lawyer" };
}

interface ClientRequest {
  files?: {
    photo?: Express.Multer.File[];
    [fieldname: string]: Express.Multer.File[] | undefined;
  };
  body: any;
}

export class ClientController {
  async getClientById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const client = await clientService.getClientById(Number(id));
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CLIENT.CLIENT_SUCCESS_RETRIEVED,
            `/clients/${id}`,
            client
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getAllClients(req: Request, res: Response): Promise<Response> {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const { data, meta } = await clientService.getAllClientsPaginated(
        page,
        limit,
        skip
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CLIENT.CLIENT_SUCCESS_LIST_RETRIEVED,
            "/clients",
            data,
            meta
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getClientProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              "/clients/profile",
              null
            )
          );
      }
      const client = await clientService.getClientProfile(authReq.user.id);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CLIENT.CLIENT_SUCCESS_RETRIEVED,
            "/clients/profile",
            client
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async updateClientProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      const clientReq = req as ClientRequest;

      if (!authReq.user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.UNAUTHORIZED.code,
              "Unauthorized",
              "/clients/profile",
              null
            )
          );
      }

      if (authReq.user.user_type !== "client") {
        return res
          .status(HttpStatusCodes.FORBIDDEN.code)
          .json(
            buildHttpResponse(
              HttpStatusCodes.FORBIDDEN.code,
              "Access denied: not a client",
              "/clients/profile",
              null
            )
          );
      }

      const photoFile = clientReq.files?.photo?.[0];
      const maxPhotoSizeBytes = 5 * 1024 * 1024; // 5 MB
      const allowedPhotoTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (photoFile) {
        if (!allowedPhotoTypes.includes(photoFile.mimetype)) {
          throw new AppError(
            "File type for 'photo' not allowed. Only JPEG, PNG, GIF or WebP.",
            HttpStatusCodes.BAD_REQUEST.code
          );
        }

        if (photoFile.size > maxPhotoSizeBytes) {
          throw new AppError(
            `Photo file size exceeds the limit (${
              maxPhotoSizeBytes / 1024 / 1024
            }MB).`,
            HttpStatusCodes.BAD_REQUEST.code
          );
        }
      }

      const updateData = UpdateClientSchema.parse(req.body);
      const updated = await clientService.updateClientProfile(
        authReq.user.id,
        updateData,
        photoFile
      );

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CLIENT.CLIENT_SUCCESS_PROFILE_UPDATED,
            "/clients/profile",
            updated
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const zodResp = handleZodError(error, req);
        zodResp.path = "/clients/profile";
        return res.status(zodResp.status).json(zodResp);
      }
      return handleServerError(res, req, error);
    }
  }

  async registerClient(req: Request, res: Response): Promise<Response> {
    try {
      const clientReq = req as ClientRequest;
      const photoFile = clientReq.files?.photo?.[0];
      const maxPhotoSizeBytes = 5 * 1024 * 1024; // 5 MB
      const allowedPhotoTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!photoFile) {
        throw new AppError(
          "The 'photo' file is required.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      if (!allowedPhotoTypes.includes(photoFile.mimetype)) {
        throw new AppError(
          "File type for 'photo' not allowed. Only JPEG, PNG, GIF or WebP.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      if (photoFile.size > maxPhotoSizeBytes) {
        throw new AppError(
          `Photo file size exceeds the limit (${
            maxPhotoSizeBytes / 1024 / 1024
          }MB).`,
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      // Convertir los tipos de datos antes de la validación
      const parsedData = {
        ...req.body,
        id: Number(req.body.id),
        budget: req.body.budget,
        coordinates: req.body.coordinates
          ? typeof req.body.coordinates === "string"
            ? JSON.parse(req.body.coordinates)
            : req.body.coordinates
          : undefined,
      };

      // Si las coordenadas existen, convertir sus valores a números
      if (parsedData.coordinates) {
        parsedData.coordinates = {
          latitude: Number(parsedData.coordinates.latitude),
          longitude: Number(parsedData.coordinates.longitude),
        };
      }

      const data = RegisterClientSchema.parse(parsedData);
      const client = await clientService.registerClient(data, photoFile);

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            MESSAGES.CLIENT.CLIENT_SUCCESS_REGISTERED,
            "/clients/register",
            client
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const zodResp = handleZodError(error, req);
        zodResp.path = "/clients/register";
        return res.status(zodResp.status).json(zodResp);
      }
      return handleServerError(res, req, error);
    }
  }
}
