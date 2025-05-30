import { Request, Response } from "express";
import { PublicationService } from "../services/publication.service";
import { PublicationRepository } from "../../data/repository/publication.repository";
import { CreatePublicationSchema } from "../../domain/dtos/create_publication.dto";
import { UpdatePublicationSchema } from "../../domain/dtos/update_publication.dto";
import { ZodError } from "zod";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

const service = new PublicationService(new PublicationRepository());

export class PublicationController {
  async create(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", req.path)
        );
      }
      const communityId = Number(req.params.communityId);
      const data = CreatePublicationSchema.parse(req.body);
      const pub = await service.create(communityId, data, authReq.user.id);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.COMMUNITY.PUBLICATION_SUCCESS_CREATED,
          `/community/${communityId}/publication`,
          pub
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const z = handleZodError(error, req);
        return res.status(z.status).json(z);
      }
      return handleServerError(res, req, error);
    }
  }

  async getByCommunity(req: Request, res: Response) {
    try {
      const communityId = Number(req.params.communityId);
      const list = await service.getByCommunityId(communityId);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.PUBLICATION_SUCCESS_LIST_RETRIEVED,
          `/community/${communityId}/publication`,
          list
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const pub = await service.getById(id);
      if (!pub) return res.status(HttpStatusCodes.NOT_FOUND.code).json({ error: "Publication not found" });
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.PUBLICATION_SUCCESS_RETRIEVED,
          `/community/${pub.community_id}/publication/${id}`,
          pub
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", req.path)
        );
      }
      const id = Number(req.params.id);
      const data = UpdatePublicationSchema.parse(req.body);
      const updated = await service.update(id, authReq.user.id, data);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.PUBLICATION_SUCCESS_UPDATED,
          `/community/${updated.community_id}/publication/${id}`,
          updated
        )
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const z = handleZodError(error, req);
        return res.status(z.status).json(z);
      }
      return handleServerError(res, req, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", req.path)
        );
      }
      const id = Number(req.params.id);
      await service.delete(id, authReq.user.id);
      return res.status(HttpStatusCodes.NO_CONTENT.code).json(
        buildHttpResponse(
          HttpStatusCodes.NO_CONTENT.code,
          MESSAGES.COMMUNITY.PUBLICATION_SUCCESS_DELETED,
          `/community/${id}/publication`,
          {}
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
