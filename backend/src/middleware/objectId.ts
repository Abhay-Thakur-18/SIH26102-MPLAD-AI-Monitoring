import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

export const requireObjectId =
  (param = "id") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const value = req.params[param];
    if (!value || !mongoose.Types.ObjectId.isValid(value)) {
      next(new ApiError(400, `Invalid ${param}`));
      return;
    }
    next();
  };
