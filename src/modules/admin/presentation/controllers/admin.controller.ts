import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { RegisterArticleCategorySchema } from "../../domain/dtos/register_article_category.dto";
import { RegisterServiceCategorySchema } from "../../domain/dtos/register_service_category.dto";
import { RegisterCommunityCategorySchema } from "../../domain/dtos/register_community_category.dto";
import { RegisterCaseCategorySchema } from "../../domain/dtos/register_case_category.dto";
import { RegisterCaseStatusSchema } from "../../domain/dtos/register_case_status.dto";
import { RegisterAttachmentCategorySchema } from "../../domain/dtos/register_attachment_category.dto";
import { UpdateArticleCategorySchema } from "../../domain/dtos/update_article_category.dto";
import { UpdateServiceCategorySchema } from "../../domain/dtos/update_service_category.dto";
import { UpdateCommunityCategorySchema } from "../../domain/dtos/update_community_category.dto";
import { UpdateCaseCategorySchema } from "../../domain/dtos/update_case_category.dto";
import { UpdateCaseStatusSchema } from "../../domain/dtos/update_case_status.dto";
import { UpdateAttachmentCategorySchema } from "../../domain/dtos/update_attachment_category.dto";
import { ZodError } from "zod";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";

const adminService = new AdminService();

export class AdminController {

  registerArticleCategory = async (req: Request, res: Response) => {
    try {
      const dto = RegisterArticleCategorySchema.parse(req.body);
      const created = await adminService.registerArticleCategory(dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code, 
          MESSAGES.ADMIN.ARTICLE_CATEGORY_CREATED, 
          req.path, created));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  registerServiceCategory = async (req: Request, res: Response) => {
    try {
      const dto = RegisterServiceCategorySchema.parse(req.body);
      const created = await adminService.registerServiceCategory(dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code, 
          MESSAGES.ADMIN.SERVICE_CATEGORY_CREATED, 
          req.path, created));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  registerCommunityCategory = async (req: Request, res: Response) => {
    try {
      const dto = RegisterCommunityCategorySchema.parse(req.body);
      const created = await adminService.registerCommunityCategory(dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code, 
          MESSAGES.ADMIN.COMMUNITY_CATEGORY_CREATED, 
          req.path, created));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  registerCaseCategory = async (req: Request, res: Response) => {
    try {
      const dto = RegisterCaseCategorySchema.parse(req.body);
      const created = await adminService.registerCaseCategory(dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code, 
          MESSAGES.ADMIN.CASE_CATEGORY_CREATED, 
          req.path, created));
    } catch (error: any) { 
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  registerCaseStatus = async (req: Request, res: Response) => {
    try {
      const dto = RegisterCaseStatusSchema.parse(req.body);
      const created = await adminService.registerCaseStatus(dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code, 
          MESSAGES.ADMIN.CASE_STATUS_CREATED, 
          req.path, created));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  registerAttachmentCategory = async (req: Request, res: Response) => {
    try {
      const dto = RegisterAttachmentCategorySchema.parse(req.body);
      const created = await adminService.registerAttachmentCategory(dto);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code, 
          MESSAGES.ADMIN.ATTACHMENT_CATEGORY_CREATED, 
          req.path, created));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  updateArticleCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = UpdateArticleCategorySchema.parse(req.body);
      const updated = await adminService.updateArticleCategory(id, dto);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.ARTICLE_CATEGORY_UPDATED, 
          req.path, updated));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  updateServiceCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = UpdateServiceCategorySchema.parse(req.body);
      const updated = await adminService.updateServiceCategory(id, dto);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.SERVICE_CATEGORY_UPDATED, 
          req.path, updated));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  updateCommunityCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = UpdateCommunityCategorySchema.parse(req.body);
      const updated = await adminService.updateCommunityCategory(id, dto);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.COMMUNITY_CATEGORY_UPDATED, 
          req.path, updated));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  updateCaseCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = UpdateCaseCategorySchema.parse(req.body);
      const updated = await adminService.updateCaseCategory(id, dto);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.CASE_CATEGORY_UPDATED, 
          req.path, updated));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  updateCaseStatus = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = UpdateCaseStatusSchema.parse(req.body);
      const updated = await adminService.updateCaseStatus(id, dto);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.CASE_STATUS_UPDATED, 
          req.path, updated));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  updateAttachmentCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dto = UpdateAttachmentCategorySchema.parse(req.body);
      const updated = await adminService.updateAttachmentCategory(id, dto);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.ATTACHMENT_CATEGORY_UPDATED, 
          req.path, updated));
    } catch (error: any) {
      if (error instanceof ZodError) {
      const zodResp = handleZodError(error, req);
      zodResp.path = req.path;
      return res.status(zodResp.status).json(zodResp);
    }
      return handleServerError(res, req, error);
    }
  };

  deleteArticleCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await adminService.deleteArticleCategory(id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.ARTICLE_CATEGORY_DELETED, 
          req.path, deleted));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  deleteServiceCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await adminService.deleteServiceCategory(id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.SERVICE_CATEGORY_DELETED, 
          req.path, deleted));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  deleteCommunityCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await adminService.deleteCommunityCategory(id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.COMMUNITY_CATEGORY_DELETED, 
          req.path, deleted));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  deleteCaseCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await adminService.deleteCaseCategory(id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.CASE_CATEGORY_DELETED, 
          req.path, deleted));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  deleteCaseStatus = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await adminService.deleteCaseStatus(id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.CASE_STATUS_DELETED, 
          req.path, deleted));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  deleteAttachmentCategory = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await adminService.deleteAttachmentCategory(id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.ATTACHMENT_CATEGORY_DELETED, 
          req.path, deleted));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  getArticleCategories = async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const data = await adminService.getArticleCategories(page, limit, skip);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.ARTICLE_CATEGORY_FETCH_SUCCESS, 
          req.path, data));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  getServiceCategories = async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const data = await adminService.getServiceCategories(page, limit, skip);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.SERVICE_CATEGORY_FETCH_SUCCESS, 
          req.path, data));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  getCommunityCategories = async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const data = await adminService.getCommunityCategories(page, limit, skip);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.COMMUNITY_CATEGORY_FETCH_SUCCESS, 
          req.path, data));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  getCaseCategories = async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const data = await adminService.getCaseCategories(page, limit, skip);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.CASE_CATEGORY_FETCH_SUCCESS, 
          req.path, data));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  getCaseStatuses = async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const data = await adminService.getCaseStatuses(page, limit, skip);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.CASE_STATUS_FETCH_SUCCESS, 
          req.path, data));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };

  getAttachmentCategories = async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const data = await adminService.getAttachmentCategories(page, limit, skip);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code, 
          MESSAGES.ADMIN.ATTACHMENT_CATEGORY_FETCH_SUCCESS, 
          req.path, data));
    } catch (error: any) {
      return handleServerError(res, req, error);
    }
  };
}
