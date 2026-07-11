import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { config } from "../config";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // Log unexpected errors
    console.error("❌ UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(config.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
