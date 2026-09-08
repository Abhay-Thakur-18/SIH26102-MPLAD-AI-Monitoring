import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: { body?: z.ZodType; params?: ZodSchemaLike; query?: z.ZodType; headers?: z.ZodType }) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.params) req.params = schema.params.parse(req.params) as typeof req.params;
      if (schema.query) req.query = schema.query.parse(req.query) as typeof req.query;
      if (schema.headers) schema.headers.parse(req.headers);
      next();
    } catch (err) {
      next(err);
    }
  };

type ZodSchemaLike = z.ZodType;

export const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

export { ApiError };
