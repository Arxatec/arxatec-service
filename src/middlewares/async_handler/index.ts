// src/middlewares/async_handler/index.ts
import { Request, Response, NextFunction } from "express";
import { handleServerError } from "../../utils/error_handler";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => any | Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: any) => {
      return handleServerError(res, req, error);
    });
  };
};
