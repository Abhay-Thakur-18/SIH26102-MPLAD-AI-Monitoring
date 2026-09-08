import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { env } from "../config/env";
import { AccessPayload } from "../utils/tokens";
import { ApiError } from "../utils/ApiError";
import { sessionService } from "../services/session.service";
import { ROLE_PERMISSIONS } from "../config/permissions";
import { userRepository } from "../repositories/user.repository";
import { UserStatus } from "../config/constants";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_ACCESS_SECRET
    },
    async (payload: AccessPayload, done) => {
      try {
        if (payload.type !== "access") return done(null, false);
        const blacklisted = await sessionService.isAccessBlacklisted(payload.sessionId);
        if (blacklisted) return done(null, false);
        const session = await sessionService.getSession(payload.sessionId);
        if (!session || session.userId !== payload.sub) return done(null, false);
        const user = await userRepository.findById(payload.sub);
        if (!user || user.status !== UserStatus.ACTIVE) return done(null, false);
        return done(null, {
          id: user.id,
          role: user.role,
          sessionId: payload.sessionId,
          permissions: ROLE_PERMISSIONS[user.role],
          district: user.profile.district,
          state: user.profile.state,
          mpCode: user.profile.mpCode
        });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate("jwt", { session: false }, (err: unknown, user: Express.Request["authUser"]) => {
    if (err) return next(err);
    if (!user) return next(new ApiError(401, "Unauthorized"));
    req.authUser = user;
    next();
  })(req, res, next);
};
