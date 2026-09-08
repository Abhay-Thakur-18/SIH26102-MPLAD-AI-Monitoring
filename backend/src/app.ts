import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { requestIdMiddleware } from "./middleware/requestId";
import { globalRateLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import v1Router from "./routes/v1";
import { swaggerSpec } from "./docs/swagger";

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  );

  // CORS
  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-request-id"]
    })
  );

  // Compression
  app.use(compression());

  // Body Parsers & Cookie Parser
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Data Sanitization against NoSQL injection and HTTP Parameter Pollution
  app.use(mongoSanitize());
  app.use(hpp());

  // Request ID
  app.use(requestIdMiddleware);

  // HTTP Request Logging
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream: { write: (message: string) => logger.http(message.trim()) }
    })
  );

  // Health Check Endpoints
  const healthHandler = (req: Request, res: Response) => {
    res.status(200).json({
      status: "UP",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: env.APP_NAME,
      environment: env.NODE_ENV,
      requestId: req.requestId
    });
  };

  app.get("/health", healthHandler);
  app.get(`${env.API_PREFIX}/health`, healthHandler);

  // Swagger Documentation
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/swagger.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Global Rate Limiter for API Endpoints
  app.use(env.API_PREFIX, globalRateLimiter);

  // Mount API v1 Routes
  app.use(env.API_PREFIX, v1Router);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;
