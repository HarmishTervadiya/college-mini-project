export type VideoOperation = "resize" | "trim" | "convert" | "extract_audio" | "watermark";

export interface UploadVideoInput {
  file: File;
  operations: VideoOperation[];
  resolution: string;
  trimStart: number;
  trimDuration: number;
  convertFormat: string;
  watermarkText: string;
}

export interface CreatedJob {
  jobId: string;
  operations: string[];
}

export type TrackedJobStatus = "queued" | "processing" | "completed" | "failed";

export interface TrackedJob {
  jobId: string;
  filename: string;
  operations: string[];
  status: TrackedJobStatus;
  downloadUrls: string[];
  error?: string;
  createdAt: string;
}
