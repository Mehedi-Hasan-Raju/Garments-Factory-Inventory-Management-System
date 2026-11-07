import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode =
    error instanceof ApiError ? error.statusCode : 500;

  const message =
    error instanceof ApiError
      ? error.message
      : "Internal Server Error";

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};