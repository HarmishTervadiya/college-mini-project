import { io, Socket } from "socket.io-client";
import { VideoJob } from "../utils/mock-data";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private mockIntervals: Map<string, number> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.socket = io(SOCKET_URL, {
        reconnectionAttempts: 3,
        timeout: 4000,
        transports: ["websocket", "polling"],
        autoConnect: true
      });

      this.socket.on("connect", () => {
        this.emitLocal("connection_status", { status: "connected" });
      });

      this.socket.on("disconnect", () => {
        this.emitLocal("connection_status", { status: "disconnected" });
      });

      this.socket.on("connect_error", () => {
        this.emitLocal("connection_status", { status: "fallback_simulation" });
      });

      this.socket.on("job_update", (data: any) => {
        const jobId = String(data?.jobId);
        if (data?.status === "processing") {
          this.emitLocal("job:progress", {
            jobId,
            progress: 50,
            fps: 54.0,
            speed: "2.1x",
            status: "processing",
            log: `[worker] Job ${jobId} is currently processing on transcoding node`
          });
        } else if (data?.status === "completed") {
          const downloadUrl = data?.downloadUrls?.[0] || "";
          this.emitLocal("job:completed", {
            jobId,
            status: "completed",
            progress: 100,
            outputUrl: downloadUrl,
            downloadUrls: data?.downloadUrls || [],
            completedAt: new Date().toISOString(),
            log: `[worker] Job ${jobId} completed successfully`
          });
        } else if (data?.status === "failed") {
          this.emitLocal("job:failed", {
            jobId,
            status: "failed",
            error: data?.error || "Worker transcoding job failed"
          });
        }
      });

      this.socket.on("job:progress", (data) => this.emitLocal("job:progress", data));
      this.socket.on("job:log", (data) => this.emitLocal("job:log", data));
      this.socket.on("job:completed", (data) => this.emitLocal("job:completed", data));
      this.socket.on("job:failed", (data) => this.emitLocal("job:failed", data));
    } catch {
      this.emitLocal("connection_status", { status: "fallback_simulation" });
    }
  }

  public on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emitLocal(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  public simulateJobProgress(job: VideoJob) {
    if (this.mockIntervals.has(job.id)) {
      clearInterval(this.mockIntervals.get(job.id));
    }

    let progress = job.progress || 10;
    let frame = 120;

    const interval = window.setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      frame += Math.floor(Math.random() * 45) + 30;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.mockIntervals.delete(job.id);

        this.emitLocal("job:completed", {
          jobId: job.id,
          status: "completed",
          progress: 100,
          outputUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          completedAt: new Date().toISOString(),
          outputSize: Math.floor(job.originalSize * 0.45),
          log: `[ffmpeg] video:${Math.floor(job.originalSize * 0.4 / 1024)}kB muxing complete. Success.`
        });
      } else {
        const fps = (45 + Math.random() * 15).toFixed(1);
        const speed = (1.8 + Math.random() * 0.6).toFixed(2);
        const logLine = `[ffmpeg] frame=${frame} fps=${fps} q=23.0 size=${Math.floor(progress * 1200)}kB speed=${speed}x`;

        this.emitLocal("job:progress", {
          jobId: job.id,
          progress,
          fps: parseFloat(fps),
          speed: `${speed}x`,
          status: "processing",
          log: logLine
        });
      }
    }, 1200);

    this.mockIntervals.set(job.id, interval);
  }

  public cancelSimulation(jobId: string) {
    if (this.mockIntervals.has(jobId)) {
      clearInterval(this.mockIntervals.get(jobId));
      this.mockIntervals.delete(jobId);
    }
  }
}

export const socketService = new SocketService();
