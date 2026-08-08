export interface JobOptions {
  filename?: string;
  outputName?: string;
  container: string;
  videoCodec: string;
  audioCodec: string;
  resolution: string;
  preset: string;
  crf: number;
  videoBitrate?: string;
  audioBitrate?: string;
  fps?: number;
  startTime?: number;
  endTime?: number;
  speedMultiplier?: number;
  filters?: string[];
  watermarkText?: string;
  watermarkPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  hardwareAccel?: "none" | "cuda" | "qsv" | "vaapi";
  twoPass?: boolean;
}

export function generateFfmpegCommand(options: JobOptions): string {
  const input = options.filename ? `"${options.filename}"` : `"input.mp4"`;
  const outputExt = options.container || "mp4";
  const output = options.outputName ? `"${options.outputName}.${outputExt}"` : `"output_${Date.now()}.${outputExt}"`;
  
  const args: string[] = ["ffmpeg"];

  if (options.hardwareAccel && options.hardwareAccel !== "none") {
    args.push(`-hwaccel ${options.hardwareAccel}`);
  }

  if (options.startTime && options.startTime > 0) {
    args.push(`-ss ${options.startTime}`);
  }

  if (options.endTime && options.endTime > 0) {
    args.push(`-to ${options.endTime}`);
  }

  args.push(`-i ${input}`);

  if (options.videoCodec === "copy") {
    args.push("-c:v copy");
  } else {
    args.push(`-c:v ${options.videoCodec}`);
    if (options.preset) {
      args.push(`-preset ${options.preset}`);
    }
    if (options.crf !== undefined && options.crf >= 0) {
      args.push(`-crf ${options.crf}`);
    }
    if (options.videoBitrate) {
      args.push(`-b:v ${options.videoBitrate}`);
    }
  }

  const vfFilters: string[] = [];

  if (options.resolution && options.resolution !== "source") {
    const [w, h] = options.resolution.split("x");
    if (w && h) {
      vfFilters.push(`scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`);
    }
  }

  if (options.filters && options.filters.length > 0) {
    options.filters.forEach((f) => vfFilters.push(f));
  }

  if (options.speedMultiplier && options.speedMultiplier !== 1) {
    const ptsMultiplier = (1 / options.speedMultiplier).toFixed(4);
    vfFilters.push(`setpts=${ptsMultiplier}*PTS`);
  }

  if (options.watermarkText && options.watermarkText.trim().length > 0) {
    let pos = "x=w-tw-20:y=h-th-20";
    if (options.watermarkPosition === "top-left") pos = "x=20:y=20";
    if (options.watermarkPosition === "top-right") pos = "x=w-tw-20:y=20";
    if (options.watermarkPosition === "bottom-left") pos = "x=20:y=h-th-20";
    if (options.watermarkPosition === "center") pos = "x=(w-tw)/2:y=(h-th)/2";
    vfFilters.push(`drawtext=text='${options.watermarkText}':fontcolor=white@0.8:fontsize=24:${pos}`);
  }

  if (vfFilters.length > 0 && options.videoCodec !== "copy") {
    args.push(`-vf "${vfFilters.join(",")}"`);
  }

  if (options.fps && options.fps > 0 && options.videoCodec !== "copy") {
    args.push(`-r ${options.fps}`);
  }

  if (options.audioCodec === "none") {
    args.push("-an");
  } else if (options.audioCodec === "copy") {
    args.push("-c:a copy");
  } else {
    args.push(`-c:a ${options.audioCodec}`);
    if (options.audioBitrate) {
      args.push(`-b:a ${options.audioBitrate}`);
    }
    if (options.speedMultiplier && options.speedMultiplier !== 1) {
      args.push(`-filter:a "atempo=${options.speedMultiplier}"`);
    }
  }

  if (options.container === "mp4") {
    args.push("-movflags +faststart");
  }

  args.push("-y");
  args.push(output);

  return args.join(" ");
}
