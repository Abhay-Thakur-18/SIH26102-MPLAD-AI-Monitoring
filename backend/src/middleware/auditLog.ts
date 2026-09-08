import { NextFunction, Request, Response } from "express";
import { activityLogRepository } from "../repositories/activity.repository";

export const auditLog =
  (action: string, entityType: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    res.on("finish", () => {
      if (res.statusCode >= 400) return;
      void activityLogRepository.create({
        actor: req.authUser?.id as never,
        action,
        entityType,
        entityId: req.params.id,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        requestId: req.requestId,
        metadata: { method: req.method, path: req.originalUrl }
      });
    });
    next();
  };
