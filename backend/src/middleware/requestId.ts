import { NextFunction, Request, Response } from "express";
import { newRequestId } from "../utils/ApiResponse";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  req.requestId = (req.headers["x-request-id"] as string) || newRequestId();
  res.setHeader("x-request-id", req.requestId);
  next();
};
