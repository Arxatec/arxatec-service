import { Request, Response } from "express";
import { ClientService } from "../services/client.service";
import { ClientRepository } from "../../data/repository/client.repository";
import { UpdateClientSchema } from "../../domain/dtos/update_client.dto";
import { RegisterClientSchema } from "../../domain/dtos/register_client.dto";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);

interface AuthenticatedRequest extends Request {
  user?: { id: number; user_type: "admin" | "client" | "lawyer" };
}

export class ClientController {
  async getClientById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const client = await clientService.getClientById(Number(id));
      return res.status(HttpStatusCodes.OK.code).json(
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

  async getAllClients(_req: Request, res: Response): Promise<Response> {
    try {
      const clients = await clientService.getAllClients();
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.CLIENT.CLIENT_SUCCESS_LIST_RETRIEVED,
          "/clients",
          clients
        )
      );
    } catch (error) {
      return handleServerError(res, _req, error);
    }
  }

  async getClientProfile(req: Request, res: Response): Promise<Response> {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(
            HttpStatusCodes.UNAUTHORIZED.code,
            "Unauthorized",
            "/clients/profile",
            null
          )
        );
      }
      const client = await clientService.getClientProfile(authReq.user.id);
      return res.status(HttpStatusCodes.OK.code).json(
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
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(
            HttpStatusCodes.UNAUTHORIZED.code,
            "Unauthorized",
            "/clients/profile",
            null
          )
        );
      }
      if (authReq.user.user_type !== "client") {
        return res.status(HttpStatusCodes.FORBIDDEN.code).json(
          buildHttpResponse(
            HttpStatusCodes.FORBIDDEN.code,
            "Access denied: not a client",
            "/clients/profile",
            null
          )
        );
      }
      const updateData = UpdateClientSchema.parse(req.body);
      const updated = await clientService.updateClientProfile(authReq.user.id, updateData);
      return res.status(HttpStatusCodes.OK.code).json(
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
      const data = RegisterClientSchema.parse(req.body);
      const client = await clientService.registerClient(data);
      return res.status(HttpStatusCodes.CREATED.code).json(
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
