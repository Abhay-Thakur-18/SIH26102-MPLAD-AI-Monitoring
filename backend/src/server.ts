import http from "http";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { connectRedis, redis } from "./config/redis";
import { createSocketServer } from "./sockets";
import { startWorkers } from "./jobs/workers";

let server: http.Server;

async function bootstrap() {
  try {
    logger.info("Initializing AEGIS-MPLADS AI Server...");

    // Connect to Database
    await connectDatabase();

    // Connect to Redis
    await connectRedis();

    // Create HTTP Server
    server = http.createServer(app);

    // Initialize Socket.IO Server
    const io = createSocketServer(server);
    logger.info("Socket.IO initialized");

    // Initialize BullMQ Workers
    startWorkers();

    // Start Listening
    server.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`API Base URL: ${env.APP_URL}${env.API_PREFIX}`);
      logger.info(`Swagger Documentation: ${env.APP_URL}/api-docs`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      if (server) {
        server.close(async () => {
          logger.info("HTTP server closed");

          try {
            await disconnectDatabase();
            await redis.quit();
            logger.info("Database and Redis connections closed cleanly");
            process.exit(0);
          } catch (err) {
            logger.error("Error during graceful shutdown", { error: err });
            process.exit(1);
          }
        });

        // Force shutdown after 10s if hanging
        setTimeout(() => {
          logger.error("Forcing shutdown after timeout");
          process.exit(1);
        }, 10000);
      } else {
        process.exit(0);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason: unknown) => {
      logger.error("Unhandled Rejection detected", { error: reason });
    });

    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception detected", { error: error.message, stack: error.stack });
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to bootstrap server", { error });
    process.exit(1);
  }
}

bootstrap();
