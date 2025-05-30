import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { CommentRepository } from "../../data/repository/comment.repository";
import { CreateCommentSchema } from "../../domain/dtos/create_comment.dto";
import { UpdateCommentSchema } from "../../domain/dtos/update_comment.dto";
import { ZodError } from "zod";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

const service = new CommentService(new CommentRepository());

export class CommentController {
  async create(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", req.path)
        );
      }
      const publication_id = Number(req.params.publicationId);
      const data = CreateCommentSchema.parse(req.body);
      const created = await service.create(publication_id, authReq.user.id, data);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.COMMUNITY.COMMENT_SUCCESS_CREATED,
          `/community/comment/publication/${publication_id}`,
          created
        )
      );
    } catch (err) {
      if (err instanceof ZodError) {
        const z = handleZodError(err, req);
        return res.status(z.status).json(z);
      }
      return handleServerError(res, req, err);
    }
  }

  async getByPublication(req: Request, res: Response) {
    try {
      const publication_id = Number(req.params.publicationId);
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const { data, meta } = await service.getCommentsPaginated(publication_id, page, limit, skip);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMENT_SUCCESS_LIST_RETRIEVED,
          `/community/comment/publication/${publication_id}`,
          data,
          meta
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
      const data = UpdateCommentSchema.parse(req.body);
      const updated = await service.update(id, authReq.user.id, data);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMENT_SUCCESS_UPDATED,
          `/community/comment/publication/${updated.publication_id}`,
          updated
        )
      );
    } catch (error) {
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
          MESSAGES.COMMUNITY.COMMENT_SUCCESS_DELETED,
          `/community/comment/publication/${id}`,
          {}
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
