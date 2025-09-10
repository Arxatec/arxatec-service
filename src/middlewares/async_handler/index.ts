import { Request, Response, NextFunction } from "express";
import { handleServerError } from "../../utils";

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => any | Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: any) => {
      return handleServerError(res, req, error);
    });
  };
};
