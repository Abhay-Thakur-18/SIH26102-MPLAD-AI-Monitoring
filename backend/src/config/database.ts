import mongoose from "mongoose";
import { env } from "./env";
import { dbLogger } from "./logger";

export const connectDatabase = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI);
  dbLogger.info("MongoDB connected");
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  dbLogger.info("MongoDB disconnected");
};
