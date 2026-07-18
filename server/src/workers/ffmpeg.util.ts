import path from "path";
import Ffmpeg from "fluent-ffmpeg";

export function runFfmpeg(inputPath: string, outputPath: string, configureFfmpeg: (command: any) => any): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = Ffmpeg(inputPath);
    configureFfmpeg(command)
      .output(outputPath)
      .on("end", () => resolve(path.basename(outputPath)))
      .on("error", (err: any) => reject(err))
      .run();
  });
}

export async function processVideoLogic(jobId: string | undefined, data: any) {
  const { 
    path: inputPath, 
    outputPath: outputDir, 
    options = [],
    resolution, 
    trimStart, 
    trimDuration, 
    convertFormat, 
    watermarkText 
  } = data;

  const tasks = [];

  if (options.includes("resize") && resolution) {
    const resizedFile = `jobid-${jobId}-resized.mp4`;
    tasks.push(
      runFfmpeg(inputPath, path.join(outputDir, resizedFile), (cmd) => cmd.size(resolution))
    );
  }

  if (options.includes("trim") && trimDuration) {
    const trimmedFile = `jobid-${jobId}-trimmed.mp4`;
    tasks.push(
      runFfmpeg(inputPath, path.join(outputDir, trimmedFile), (cmd) => cmd.setStartTime(trimStart || 0).setDuration(trimDuration))
    );
  }

  if (options.includes("convert") && convertFormat) {
    const convertedFile = `jobid-${jobId}-converted.${convertFormat}`;
    tasks.push(
      runFfmpeg(inputPath, path.join(outputDir, convertedFile), (cmd) => cmd.toFormat(convertFormat))
    );
  }

  if (options.includes("extract_audio")) {
    const audioFile = `jobid-${jobId}-audio.mp3`;
    tasks.push(
      runFfmpeg(inputPath, path.join(outputDir, audioFile), (cmd) => cmd.noVideo().toFormat("mp3"))
    );
  }

  if (options.includes("watermark") && watermarkText) {
    const watermarkedFile = `jobid-${jobId}-watermarked.mp4`;
    tasks.push(
      runFfmpeg(inputPath, path.join(outputDir, watermarkedFile), (cmd) => 
        cmd.videoFilters({
          filter: 'drawtext',
          options: {
            text: watermarkText,
            fontsize: 40,
            fontcolor: 'white',
            x: '(w-text_w)/2',
            y: '(h-text_h)/2'
          }
        })
      )
    );
  }

  if (tasks.length === 0) {
    throw new Error("No valid options selected for processing.");
  }

  return Promise.all(tasks);
}
