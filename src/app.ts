import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// Root route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to GarmentFlow ERP API",
    version: "1.0.0",
  });
});

// Health route
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GarmentFlow ERP server is healthy",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Database health route
app.get("/api/v1/health/database", async (_req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Database health endpoint is available",
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app;