import { NextFunction, Request, Response } from "express";
import { Permission, hasPermission } from "../config/permissions";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../config/constants";

export const requirePermission =
  (...permissions: Permission[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.authUser;
    if (!user) {
      next(new ApiError(401, "Unauthorized"));
      return;
    }
    const allowed = permissions.every((p) => hasPermission(user.role, p));
    if (!allowed) {
      next(new ApiError(403, "Forbidden"));
      return;
    }
    next();
  };

export const requireRoles =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.authUser;
    if (!user) {
      next(new ApiError(401, "Unauthorized"));
      return;
    }
    if (!roles.includes(user.role)) {
      next(new ApiError(403, "Forbidden"));
      return;
    }
    next();
  };
