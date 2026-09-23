import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export type JobStatus = "processing" | "completed" | "failed";

export interface JobUpdateEvent {
  jobId: string;
  status: JobStatus;
  downloadUrls: string[];
  error?: string;
}

type JobUpdateHandler = (event: JobUpdateEvent) => void;
type StatusHandler = (connected: boolean) => void;

class JobSocket {
  private socket: Socket | null = null;
  private updateHandlers = new Set<JobUpdateHandler>();
  private statusHandlers = new Set<StatusHandler>();
  private started = false;

  start() {
    if (this.started) return;
    this.started = true;

    try {
      this.socket = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        timeout: 5000,
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => this.notifyStatus(true));
      this.socket.on("disconnect", () => this.notifyStatus(false));
      this.socket.on("connect_error", () => this.notifyStatus(false));
      this.socket.on("job_update", (raw: unknown) => {
        const event = normalizeJobUpdate(raw);
        if (event) this.notifyUpdate(event);
      });
    } catch {
      this.notifyStatus(false);
    }
  }

  onUpdate(handler: JobUpdateHandler): () => void {
    this.updateHandlers.add(handler);
    return () => {
      this.updateHandlers.delete(handler);
    };
  }

  onStatus(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  private notifyUpdate(event: JobUpdateEvent) {
    this.updateHandlers.forEach((handler) => handler(event));
  }

  private notifyStatus(connected: boolean) {
    this.statusHandlers.forEach((handler) => handler(connected));
  }
}

function normalizeJobUpdate(raw: unknown): JobUpdateEvent | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const jobId = record.jobId;
  const status = record.status;
  if ((typeof jobId !== "string" && typeof jobId !== "number") || typeof status !== "string") {
    return null;
  }
  if (status !== "processing" && status !== "completed" && status !== "failed") return null;
  const downloadUrls = Array.isArray(record.downloadUrls)
    ? record.downloadUrls.filter((url): url is string => typeof url === "string")
    : [];
  const error = typeof record.error === "string" ? record.error : undefined;
  return { jobId: String(jobId), status, downloadUrls, error };
}

export const jobSocket = new JobSocket();
