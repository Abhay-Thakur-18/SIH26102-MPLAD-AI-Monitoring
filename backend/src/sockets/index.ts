import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";
import { verifyAccessToken } from "../utils/tokens";
import { sessionService } from "../services/session.service";
import { setIo } from "./emitter";
import { logger } from "../config/logger";

export const createSocketServer = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: { origin: env.FRONTEND_ORIGIN, credentials: true }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("Unauthorized"));
      const payload = verifyAccessToken(token);
      const blacklisted = await sessionService.isAccessBlacklisted(payload.sessionId);
      if (blacklisted) return next(new Error("Unauthorized"));
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);
    logger.info("Socket connected", { userId });
    socket.on("disconnect", () => logger.info("Socket disconnected", { userId }));
  });

  setIo(io);
  return io;
};
