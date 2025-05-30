import { Request, Response } from "express";
import { CommunityService } from "../services/community.service";
import { CommunityRepository } from "../../data/repository/community.repository";
import { CreateCommunitySchema } from "../../domain/dtos/create_community.dto";
import { UpdateCommunitySchema } from "../../domain/dtos/update_community.dto";
import { ZodError } from "zod";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";

const service = new CommunityService(new CommunityRepository());

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export class CommunityController {
  async createCommunity(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", "/community")
        );
      }
      const data = CreateCommunitySchema.parse(req.body);
      const result = await service.createCommunity(authReq.user.id, data);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.COMMUNITY.COMMUNITY_SUCCESS_CREATED,
          "/community",
          result
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErr = handleZodError(error, req);
        zodErr.path = "/community";
        return res.status(zodErr.status).json(zodErr);
      }
      return handleServerError(res, req, error);
    }
  }

  async getAllCommunities(req: Request, res: Response) {
    try {
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const { data, meta } = await service.getAllCommunitiesPaginated(page, limit, skip);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMUNITY_SUCCESS_LIST_RETRIEVED,
          "/community",
          data,
          meta
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getCommunityById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await service.getCommunityById(id);
      if (!result) return res.status(HttpStatusCodes.NOT_FOUND.code).json({ error: "Comunidad no encontrada" });
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMUNITY_SUCCESS_RETRIEVED,
          `/community/${id}`,
          result
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async updateCommunity(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", "/community/profile")
        );
      }
      const id = Number(req.params.id);
      const data = UpdateCommunitySchema.parse(req.body);
      const updated = await service.updateCommunity(id, authReq.user.id, data);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMUNITY_SUCCESS_UPDATED,
          `/community/${id}`,
          updated
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErr = handleZodError(error, req);
        zodErr.path = `/community/${req.params.id}`;
        return res.status(zodErr.status).json(zodErr);
      }
      return handleServerError(res, req, error);
    }
  }

  async deleteCommunity(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", "/community")
        );
      }
      const id = Number(req.params.id);
      await service.deleteCommunity(id, authReq.user.id);
      return res.status(HttpStatusCodes.NO_CONTENT.code).json(
        buildHttpResponse(
          HttpStatusCodes.NO_CONTENT.code,
          MESSAGES.COMMUNITY.COMMUNITY_SUCCESS_DELETED,
          `/community/${id}`
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async joinCommunity(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", "/community")
        );
      }
      const communityId = Number(req.params.id);
      await service.joinCommunity(communityId, authReq.user.id);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMUNITY_SUCCESS_JOINED,
          `/community/${communityId}/join`
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
