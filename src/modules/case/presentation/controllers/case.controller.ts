// src/modules/case/presentation/controllers/case.controller.ts
import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { CasesService } from "../services/cases.service";
import { CasesRepository } from "../../data/repository/cases.repository";
import { NotificationRepository } from "../../../notification/data/repository/notification.repository";
import { NotificationService } from "../../../notification/presentation/services/notification.service"; // ✅ nuevo

import {
  CreateCaseSchema,
  UpdateCaseSchema,
  ChangeCaseStatusSchema,
  CreateCaseAttachmentSchema,
  CreateExternalClientSchema,
  CreateCaseMessageSchema,
} from "../../domain/dtos/index";

import { uploadFile } from "../../../../infrastructure/aws";

import {
  handleServerError,
  handleZodError,
} from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { AppError } from "../../../../utils/errors";

const notificationService = new NotificationService(
  new NotificationRepository()
);
const casesService = new CasesService(
  new CasesRepository(),
  notificationService
);

casesService.init().catch(console.error);
/* ─────────────── Helper user ─────────────── */
type CurrentUser = { id: number; role: "client" | "lawyer" };
const getUser = (req: Request): CurrentUser => (req as any).user as CurrentUser;

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
        const zErr = handleZodError(error, req);
        return res.status(zErr.status).json(zErr);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- GET /case/explore ---------- */
  async exploreCases(req: Request, res: Response): Promise<Response> {
    try {
      const QuerySchema = z.object({
        category_id: z.coerce.number().int().positive().optional(),
        status_id: z.coerce.number().int().positive().optional(),
      });

      const { category_id, status_id } = QuerySchema.parse(req.query);

      const filters = {
        is_public: true, 
        ...(category_id && { category_id }),
        ...(status_id && { status_id }),
      };

      const data = await casesService.exploreCases(filters);

      return res
        .status(200)
        .json(
          buildHttpResponse(200, "Cases fetched successfully", req.path, data)
        );
    } catch (error) {
      if (error instanceof z.ZodError) {
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
      if (Number.isNaN(id)) {
        throw new AppError(
          MESSAGES.CASE.INVALID_ID,
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      const data = await casesService.getCaseById(id, getUser(req));

      return res
        .status(200)
        .json(buildHttpResponse(200, "Case detail", req.path, data));
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json(buildHttpResponse(error.statusCode, error.message, req.path));
      }
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
      const dto = ChangeCaseStatusSchema.parse(req.body);

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
      const caseId = Number(req.params.id);
      const user = getUser(req);

      const found = await casesService.getCaseById(caseId, user);

      const files = req.files as { file: Express.Multer.File[] };
      const file = files.file?.[0];
      if (!file) {
        throw new AppError("File missing", HttpStatusCodes.BAD_REQUEST.code);
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new AppError(
          "El archivo supera el tamaño máximo de 10MB.",
          HttpStatusCodes.BAD_REQUEST.code
        );
      }

      const { key: s3Key } = await uploadFile(file, `private/cases/${caseId}`);

      const body = {
        service_id: found.service_id,
        file_key: s3Key,
        label: req.body.label,
        description: req.body.description,
        category_id: Number(req.body.category_id),
      };
      console.log("ATTACH BODY:", body);
      const dto = CreateCaseAttachmentSchema.parse(body);

      const created = await casesService.addAttachment(caseId, dto, user);

      return res
        .status(HttpStatusCodes.CREATED.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.CREATED.code,
            MESSAGES.CASE.ATTACHMENT_ADDED,
            req.path,
            created
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
  /* ---------- GET /case/:id/attachment ---------- */
  async listAttachments(req: Request, res: Response): Promise<Response> {
  try {
    const caseId = Number(req.params.id);
    const user   = getUser(req);

    // 1) Validar permisos y obtener el case
    await casesService.getCaseById(caseId, user);

    // 2) Obtener lista de attachments con signed-URL
    const list = await casesService.listAttachments(caseId, user);

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          "Attachments fetched successfully",
          req.path,
          list
        )
      );
  } catch (err) {
    return handleServerError(res, req, err);
  }
}
  /* ---------- GET /case/:id/attachment/:attId ---------- */
  async getAttachmentUrl(req: Request, res: Response) {
    try {
      const caseId = Number(req.params.id);
      const attId = Number(req.params.attId);
      const user = getUser(req);

      const url = await casesService.getAttachmentUrl(caseId, attId, user);

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Signed URL generated",
            req.path,
            { url }
          )
        );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
  /* ---------- ARCHIVED /case/:id/attachment/:attId ---------- */
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
    try {
      const result = await casesService.getCategories();

      return res
        .status(HttpStatusCodes.OK.code)
        .json(
          buildHttpResponse(
            HttpStatusCodes.OK.code,
            "Categories fetched successfully.",
            req.path,
            result
          )
        );
    } catch (error) {
      if (error instanceof ZodError) {
        const zErr = handleZodError(error, req);
        return res.status(zErr.status).json(zErr);
      }
      return handleServerError(res, req, error);
    }
  }

  /* ---------- GET /case/types ---------- */
  async getStatuses(req: Request, res: Response): Promise<Response> {
    const data = await casesService.getStatuses();

    return res
      .status(HttpStatusCodes.OK.code)
      .json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.CASE.STATUSES_SUCCESS,
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
