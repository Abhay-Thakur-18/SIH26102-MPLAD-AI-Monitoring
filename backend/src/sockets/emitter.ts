import { Server } from "socket.io";
import { logger } from "../config/logger";

let io: Server | null = null;

export const setIo = (server: Server): void => {
  io = server;
};

export const emitEvent = (event: string, payload: unknown): void => {
  if (!io) {
    logger.debug("Socket emit skipped (not initialized)", { event });
    return;
  }
  io.emit(event, payload);
};

export const emitToUser = (userId: string, event: string, payload: unknown): void => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
};
