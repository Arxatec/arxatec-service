// src/modules/case/presentation/controllers/case.controller.ts
import { Request, Response } from "express";
import { ZodError, z } from "zod";

import { CasesService } from "../services/cases.service";
import { CasesRepository } from "../../data/repository/cases.repository";
import { NotificationRepository } from "../../../notification/data/repository/notification.repository";

import {
  CreateCaseSchema,
  UpdateCaseSchema,
  ChangeStatusCaseSchema,
  CreateCaseAttachmentSchema,
  CreateExternalClientSchema,
  CreateCaseMessageSchema,
} from "../../domain/dtos/index";

import {
  handleServerError,
  handleZodError,
} from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { AppError } from "../../../../utils/errors";
/* ─────────────── Init service (DI) ─────────────── */
const casesService = new CasesService(
  new CasesRepository(),
  new NotificationRepository()
);

/* ─────────────── Current user ─────────────── */
type CurrentUser = { id: number; role: "client" | "lawyer" };
const getUser = (req: Request): CurrentUser => (req as any).user as CurrentUser;

/* ─────────────────────────────────────────────────── */
export class CaseController {
  /* ---------- POST /case ---------- */
  async createCase(req: Request, res: Response): Promise<Response> {
    try {
      const dto = CreateCaseSchema.parse(req.body);
      const result = await casesService.createCase(dto, getUser(req));

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            MESSAGES.CASE.CREATED_SUCCESS,
            req.path,
            result
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- GET /case/explore ---------- */
  async exploreCases(req: Request, res: Response): Promise<Response> {
    try {
      // query params validation
      const FiltersSchema = z.object({
        category: z
          .enum(["labor", "family", "personal", "corporate", "other"])
          .optional(),
        type: z.enum(["consultation", "case", "advisory"]).optional(),
        status: z
          .union([
            z.enum(["open", "taken", "in_progress", "closed", "archived"]),
            z.array(
              z.enum(["open", "taken", "in_progress", "closed", "archived"])
            ),
          ])
          .optional(),
      });
      const filters = FiltersSchema.parse(req.query);

      const role: "client" | "lawyer" = (req as any).user?.role ?? "client";

      const data = await casesService.exploreCases(role, filters);
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Cases fetched successfully",
            req.path,
            data
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- GET /case/my ---------- */
  async getMyCases(req: Request, res: Response): Promise<Response> {
    try {
      const data = await casesService.getMyCases(getUser(req));
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(HttpStatusCodes.OK.code, "My cases", req.path, data)
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ---------- GET /case/:id ---------- */
  async getCaseById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        throw new AppError(
          MESSAGES.CASE.INVALID_ID,
          HttpStatusCodes.BAD_REQUEST.code
        );

      const data = await casesService.getCaseById(id, getUser(req));
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Case detail",
            req.path,
            data
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ---------- PUT /case/:id ---------- */
  async updateCase(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const dto = UpdateCaseSchema.parse(req.body);

      const data = await casesService.updateCase(id, dto, getUser(req));
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CASE.UPDATED_SUCCESS,
            req.path,
            data
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- PATCH /case/:id/status ---------- */
  async changeStatus(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const dto = ChangeStatusCaseSchema.parse(req.body);

      const data = await casesService.changeStatus(id, dto, getUser(req));
      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CASE.STATUS_UPDATED_SUCCESS,
            req.path,
            data
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- PATCH /case/:id/archive ---------- */
  async archiveCase(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const data = await casesService.archiveCase(id, getUser(req));

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CASE.ARCHIVED_SUCCESS,
            req.path,
            data
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ---------- POST /case/:id/attachment ---------- */
  async addAttachment(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const dto = CreateCaseAttachmentSchema.parse(req.body);

      const data = await casesService.addAttachment(id, dto, getUser(req).id);
      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            MESSAGES.CASE.ATTACHMENT_ADDED,
            req.path,
            data
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- DELETE /case/:id/attachment/:attId ---------- */
  async archiveAttachment(req: Request, res: Response): Promise<Response> {
    try {
      const attId = Number(req.params.attId);
      await casesService.archiveAttachment(attId, getUser(req).id);

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CASE.ATTACHMENT_ARCHIVED,
            req.path
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  /* ---------- POST /case/external_client ---------- */
  async createExternalClient(req: Request, res: Response): Promise<Response> {
    try {
      const dto = CreateExternalClientSchema.parse(req.body);
      const user = getUser(req); 
      const data = await casesService.createExternalClient(dto, user.id);
  
      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            "External client created",
            req.path,
            data
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }
  
  /* ---------- GET /case/categories ---------- */
  async getCategories(req: Request, res: Response): Promise<Response> {
    const data = casesService.getCategories();
    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.CASE.CATEGORIES_SUCCESS,
          req.path,
          data
        )
      );
  }

  /* ---------- GET /case/types ---------- */
  async getTypes(req: Request, res: Response): Promise<Response> {
    const data = casesService.getTypes();
    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.CASE.TYPES_SUCCESS,
          req.path,
          data
        )
      );
  }

  /* ---------- POST /case/:id/message ---------- */
  async sendMessage(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const dto = CreateCaseMessageSchema.parse(req.body);
      const data = await casesService.sendMessage(id, dto, getUser(req));

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            MESSAGES.CASE.MESSAGE_SENT,
            req.path,
            data
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const err = handleZodError(error, req);
        return res.status(err.status).json(err);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- GET /case/:id/history ---------- */
  async getHistory(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await casesService.getHistory(id, getUser(req));

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            MESSAGES.CASE.HISTORY_FETCH_SUCCESS,
            req.path,
            data
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
