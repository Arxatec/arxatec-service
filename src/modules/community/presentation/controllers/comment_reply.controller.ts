import { Request, Response } from "express";
import { CommentReplyService } from "../services/comment_reply.service";
import { CommentReplyRepository } from "../../data/repository/comment_reply.repository";
import { CreateCommentReplySchema } from "../../domain/dtos/create_comment_reply.dto";
import { UpdateCommentReplySchema } from "../../domain/dtos/update_comment_reply.dto";
import { ZodError } from "zod";
import { handleZodError, handleServerError } from "../../../../utils/error_handler";
import { buildHttpResponse } from "../../../../utils/build_http_response";
import { HttpStatusCodes } from "../../../../constants/http_status_codes";
import { MESSAGES } from "../../../../constants/messages";
import { Pagination } from "../../../../utils/pagination";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

const service = new CommentReplyService(new CommentReplyRepository());

export class CommentReplyController {
  async create(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user) {
        return res.status(HttpStatusCodes.UNAUTHORIZED.code).json(
          buildHttpResponse(HttpStatusCodes.UNAUTHORIZED.code, "Unauthorized", req.path)
        );
      }
      const comment_id = Number(req.params.commentId);
      const data = CreateCommentReplySchema.parse(req.body);
      const created = await service.create(comment_id, authReq.user.id, data);
      return res.status(HttpStatusCodes.CREATED.code).json(
        buildHttpResponse(
          HttpStatusCodes.CREATED.code,
          MESSAGES.COMMUNITY.COMMENT_REPLY_SUCCESS_CREATED,
          `/community/reply/comment/${comment_id}`,
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

  async getByComment(req: Request, res: Response) {
    try {
      const comment_id = Number(req.params.commentId);
      const { page, limit, skip } = Pagination.getPaginationParams(req.query);
      const { data, meta } = await service.getRepliesPaginated(comment_id, page, limit, skip);

      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMENT_REPLY_SUCCESS_LIST_RETRIEVED,
          `/community/reply/comment/${comment_id}`,
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
      const data = UpdateCommentReplySchema.parse(req.body);
      const updated = await service.update(id, authReq.user.id, data);
      return res.status(HttpStatusCodes.OK.code).json(
        buildHttpResponse(
          HttpStatusCodes.OK.code,
          MESSAGES.COMMUNITY.COMMENT_REPLY_SUCCESS_UPDATED,
          `/community/reply/comment/${id}`,
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
          MESSAGES.COMMUNITY.COMMENT_REPLY_SUCCESS_DELETED,
          `/community/reply/comment/${id}`,
          {}
        )
      );
    } catch (error) {
      return handleServerError(res, req, error);
    }
  }
}
