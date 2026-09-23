import type { VideoOperation } from "./types";

export const OPERATIONS: Array<{ value: VideoOperation; label: string; hint: string }> = [
  { value: "resize", label: "Resize", hint: "Scale to a target resolution" },
  { value: "trim", label: "Trim", hint: "Cut by start time and duration" },
  { value: "convert", label: "Convert", hint: "Change container format" },
  { value: "extract_audio", label: "Extract audio", hint: "Save audio as MP3" },
  { value: "watermark", label: "Watermark", hint: "Centered text overlay" },
];

export const RESOLUTIONS = ["640x360", "854x480", "1280x720", "1920x1080"];

export const CONVERT_FORMATS = ["mp4", "webm", "avi", "mov", "mkv"];

export const DEFAULTS = {
  resolution: "640x360",
  trimStart: 0,
  trimDuration: 5,
  convertFormat: "webm",
  watermarkText: "Harmis & Heet",
};
