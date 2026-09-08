import Redis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true
});

redis.on("error", (err) => {
  logger.error("Redis error", { error: err.message });
});

export const connectRedis = async (): Promise<void> => {
  if (redis.status === "ready" || redis.status === "connecting") return;
  await redis.connect();
  logger.info("Redis connected");
};
