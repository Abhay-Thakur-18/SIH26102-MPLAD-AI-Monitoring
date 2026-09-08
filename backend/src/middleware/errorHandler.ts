import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { fail } from "../utils/ApiResponse";
import { logger } from "../config/logger";
import { isProduction } from "../config/env";

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ZodError) {
    res.status(400).json(
      fail(
        "Validation failed",
        err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        { requestId: req.requestId }
      )
    );
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(fail(err.message, err.errors, { requestId: req.requestId }));
    return;
  }

  const mongo = err as { name?: string; code?: number };
  if (mongo?.name === "MongoServerError" && mongo.code === 11000) {
    res.status(409).json(fail("Duplicate resource", null, { requestId: req.requestId }));
    return;
  }

  logger.error("Unhandled error", { error: err instanceof Error ? err.message : err, requestId: req.requestId });
  res
    .status(500)
    .json(fail(isProduction ? "Internal server error" : err instanceof Error ? err.message : "Error", null, { requestId: req.requestId }));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(fail("Route not found", null, { requestId: req.requestId }));
};
