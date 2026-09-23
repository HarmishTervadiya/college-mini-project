import axios from "axios";
import type { ErrorEnvelope } from "./response";

export type ApiErrorKind =
  | "validation"
  | "bad-request"
  | "not-found"
  | "server"
  | "network"
  | "timeout";

export class AppApiError extends Error {
  kind: ApiErrorKind;
  statusCode?: number;
  details: string[];

  constructor(message: string, kind: ApiErrorKind, statusCode?: number, details: string[] = []) {
    super(message);
    this.name = "AppApiError";
    this.kind = kind;
    this.statusCode = statusCode;
    this.details = details;
  }
}

function kindForStatus(status?: number): ApiErrorKind {
  if (status === 400) return "bad-request";
  if (status === 404) return "not-found";
  if (status && status >= 500) return "server";
  return "server";
}

export function normalizeApiError(error: unknown): AppApiError {
  if (error instanceof AppApiError) return error;

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return new AppApiError("The request timed out. Try again with a smaller file.", "timeout");
    }
    if (!error.response) {
      return new AppApiError(
        "Cannot reach the server. Check that it is running and try again.",
        "network"
      );
    }

    const status = error.response.status;
    const body = error.response.data as Partial<ErrorEnvelope> | undefined;
    const message =
      typeof body?.message === "string" && body.message.length > 0
        ? body.message
        : "Something went wrong. Try again.";
    const details = Array.isArray(body?.details)
      ? body.details.map((d) => d.message)
      : [];

    if (status === 400 && message.toLowerCase().includes("validation")) {
      return new AppApiError(message, "validation", status, details);
    }
    return new AppApiError(message, kindForStatus(status), status, details);
  }

  return new AppApiError("Something went wrong. Try again.", "server");
}

export function getErrorMessage(error: unknown): string {
  const normalized = normalizeApiError(error);
  if (normalized.details.length > 0) {
    return `${normalized.message}: ${normalized.details.join(", ")}`;
  }
  return normalized.message;
}
