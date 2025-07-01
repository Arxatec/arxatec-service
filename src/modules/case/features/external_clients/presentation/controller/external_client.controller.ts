import { Response } from "express";
import { ZodError } from "zod";

import { AuthenticatedRequest } from "../../../../../../middlewares/authenticate_token";
import { ExternalClientsService } from "../services/external_client.service";

import {
  CreateExternalClientSchema,
  CreateExternalClientDTO,
} from "../../domain/dtos/create_external_client.schema";

import {
  UpdateExternalClientSchema,
  UpdateExternalClientDTO,
} from "../../domain/dtos/update_external_client.schema";

import { HttpStatusCodes } from "../../../../../../constants";
import {
  handleServerError,
  handleZodError,
} from "../../../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../../../utils/build_http_response";
import { AppError } from "../../../../../../utils/errors";
import { getAuthenticatedUser } from "../../../../../../utils/authenticated_user/authenticated_user";

export class ExternalClientsController {
  constructor(private readonly svc = new ExternalClientsService()) {}

  /* ───────────── CREATE ───────────── */
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const dto: CreateExternalClientDTO = CreateExternalClientSchema.parse(
        req.body
      );
      const avatar = req.file as Express.Multer.File | undefined;
      const userDetailId = req.user!.id;

      const created = await this.svc.createExternalClient(
        dto,
        avatar,
        userDetailId
      );

      const user = await getAuthenticatedUser(req);

      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          "External client created",
          req.path,
          {
            client: created,
            user,
          }
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ───────────── LIST ACTIVE ───────────── */
  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const userDetailId = req.user!.id;

      const clients = await this.svc.listExternalClients(userDetailId);

      const user = await getAuthenticatedUser(req);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "External clients",
          req.path,
          {
            clients,
            user,
          }
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ───────────── UPDATE ───────────── */
  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const body: UpdateExternalClientDTO = UpdateExternalClientSchema.parse(
        req.body
      );
      const avatar = req.file as Express.Multer.File | undefined;
      const userDetailId = req.user!.id;

      const updated = await this.svc.updateExternalClient(
        id,
        body,
        avatar,
        userDetailId
      );

      const user = await getAuthenticatedUser(req);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "External client updated",
          req.path,
          {
            client: updated,
            user,
          }
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const parsed = handleZodError(error, req);
        return res.status(parsed.status).json(parsed);
      }
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json(buildHttpResponse(error.statusCode, error.message, req.path));
      }
      return handleServerError(res, req, error);
    }
  }

  /* ───────────── ARCHIVE ───────────── */
  async archive(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userDetailId = req.user!.id;

      const archived = await this.svc.archiveExternalClient(id, userDetailId);

      const user = await getAuthenticatedUser(req);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "External client archived",
          req.path,
          {
            client: archived,
            user,
          }
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ───────────── RESTORE ───────────── */
  async restore(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userDetailId = req.user!.id;

      const restored = await this.svc.restoreExternalClient(id, userDetailId);

      const user = await getAuthenticatedUser(req);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "External client restored",
          req.path,
          {
            client: restored,
            user,
          }
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ───────────── LIST ARCHIVED ───────────── */
  async listArchived(req: AuthenticatedRequest, res: Response) {
    try {
      const userDetailId = req.user!.id;

      const clients = await this.svc.listArchivedExternalClients(userDetailId);

      const user = await getAuthenticatedUser(req);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Archived external clients",
          req.path,
          {
            clients,
            user,
          }
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
