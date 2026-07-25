import path from "path";
import { videoProcessQueue } from "../../workers/video.worker";
import { AppError } from "../../utils/AppError";

interface ProcessVideoDTO {
  file: Express.Multer.File;
  options: string | string[];
  resolution: string;
  trimStart: number;
  trimDuration: number;
  convertFormat: string;
  watermarkText: string;
}

export const processVideo = async (data: ProcessVideoDTO) => {
  if (!data.file) {
    throw new AppError("No video file uploaded", 400);
  }

  const outputPath = path.join(__dirname, `../../../../uploads`);
  
  let optionsArray = data.options || ["resize", "trim", "convert", "extract_audio", "watermark"];
  if (typeof optionsArray === "string") {
    try {
      optionsArray = JSON.parse(optionsArray);
    } catch (e) {
      optionsArray = (optionsArray as string).split(",");
    }
  }

  const job = await videoProcessQueue.add(
    "transcoding",
    { 
      path: data.file.path, 
      outputPath, 
      options: optionsArray,
      resolution: data.resolution,
      trimStart: data.trimStart,
      trimDuration: data.trimDuration,
      convertFormat: data.convertFormat,
      watermarkText: data.watermarkText
    },
    {
      removeOnComplete: true,
      removeOnFail: true,
    }
  );

  return { jobId: job.id, optionsSelected: optionsArray };
};
